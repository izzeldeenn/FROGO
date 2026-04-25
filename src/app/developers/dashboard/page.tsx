'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { StoreItem } from '@/components/store/storeProducts';
import Link from 'next/link';

export default function DeveloperDashboard() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const { getCurrentUser } = useUser();
  const [activeTab, setActiveTab] = useState<'products' | 'submit' | 'earnings' | 'profile'>('products');
  const [products, setProducts] = useState<StoreItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    category: 'themes' as const,
    icon: '',
    rarity: 'common' as const,
    githubUrl: '',
    documentationUrl: '',
    version: '1.0.0',
    code: '',
    codeType: 'javascript' as 'javascript' | 'css' | 'html'
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadDeveloperProducts();
  }, [currentUser]);

  const loadDeveloperProducts = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/developer-products?developerId=${currentUser.accountId}`);
      const data = await response.json();
      
      if (data.products) {
        const developerProducts: StoreItem[] = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          nameAr: p.name_ar,
          description: p.description,
          descriptionAr: p.description_ar,
          price: p.price,
          category: p.category,
          icon: p.icon,
          rarity: p.rarity,
          purchased: false,
          isDeveloperProduct: true,
          developerId: p.developer_id,
          developerName: currentUser.username || 'Unknown Developer',
          developerAvatar: currentUser.avatar || '',
          approvalStatus: p.approval_status,
          downloads: p.downloads,
          rating: p.rating,
          version: p.version,
          githubUrl: p.github_url,
          documentationUrl: p.documentation_url,
          rejectionReason: p.rejection_reason,
          code: p.code,
          codeType: p.code_type
        }));
        setProducts(developerProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await fetch('/api/developer-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_id: currentUser.accountId,
          name: formData.name,
          name_ar: formData.nameAr,
          description: formData.description,
          description_ar: formData.descriptionAr,
          price: parseInt(formData.price),
          category: formData.category,
          icon: formData.icon,
          rarity: formData.rarity,
          github_url: formData.githubUrl,
          documentation_url: formData.documentationUrl,
          version: formData.version,
          code: formData.code,
          code_type: formData.codeType,
          sandbox_config: {}
        }),
      });

      const data = await response.json();

      if (data.product) {
        await loadDeveloperProducts();
        
        setFormData({
          name: '',
          nameAr: '',
          description: '',
          descriptionAr: '',
          price: '',
          category: 'themes',
          icon: '',
          rarity: 'common',
          githubUrl: '',
          documentationUrl: '',
          version: '1.0.0',
          code: '',
          codeType: 'javascript'
        });
        setActiveTab('products');
      }
    } catch (error) {
      console.error('Failed to submit product:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'approved': return language === 'ar' ? 'موافق عليه' : 'Approved';
      case 'rejected': return language === 'ar' ? 'مرفوض' : 'Rejected';
      case 'pending': return language === 'ar' ? 'قيد المراجعة' : 'Pending';
      default: return language === 'ar' ? 'غير معروف' : 'Unknown';
    }
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {language === 'ar' ? 'يجب تسجيل الدخول' : 'Please Login'}
          </h1>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {language === 'ar' ? 'يجب تسجيل الدخول للوصول إلى لوحة المطورين' : 'You must login to access the developer dashboard'}
          </p>
          <Link href="/" className={`inline-block px-6 py-3 rounded-xl font-bold ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      <div className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'ar' ? 'لوحة المطورين' : 'Developer Dashboard'}
              </h1>
              <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {language === 'ar' ? 'أهلاً بك، ' : 'Welcome, '}{currentUser.username}
              </p>
            </div>
            <Link href="/developers" className={`px-4 py-2 rounded-lg font-medium ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              {language === 'ar' ? 'العودة' : 'Back'}
            </Link>
          </div>
        </div>
      </div>

      <div className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button onClick={() => setActiveTab('products')} className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'products' ? 'border-blue-500 text-blue-500' : theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
              {language === 'ar' ? 'منتجاتي' : 'My Products'}
            </button>
            <button onClick={() => setActiveTab('submit')} className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'submit' ? 'border-blue-500 text-blue-500' : theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
              {language === 'ar' ? 'نشر منتج' : 'Submit Product'}
            </button>
            <button onClick={() => setActiveTab('earnings')} className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'earnings' ? 'border-blue-500 text-blue-500' : theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
              {language === 'ar' ? 'الأرباح' : 'Earnings'}
            </button>
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-2 border-b-2 font-medium ${activeTab === 'profile' ? 'border-blue-500 text-blue-500' : theme === 'light' ? 'border-transparent text-gray-500 hover:text-gray-700' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'ar' ? 'منتجاتي' : 'My Products'}
              </h2>
              <button onClick={() => setActiveTab('submit')} className={`px-4 py-2 rounded-lg font-medium ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                {language === 'ar' ? '+ منتج جديد' : '+ New Product'}
              </button>
            </div>
            
            {products.length === 0 ? (
              <div className={`text-center py-12 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'} rounded-xl`}>
                <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {language === 'ar' ? 'لم تنشر أي منتجات بعد' : 'You haven\'t published any products yet'}
                </p>
                <button onClick={() => setActiveTab('submit')} className={`mt-4 px-6 py-2 rounded-lg font-medium ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                  {language === 'ar' ? 'نشر منتجك الأول' : 'Publish Your First Product'}
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className={`p-6 rounded-xl ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-900 border border-gray-800'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl`}>{product.icon}</div>
                        <div>
                          <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {language === 'ar' ? product.nameAr : product.name}
                          </h3>
                          <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                            {language === 'ar' ? product.descriptionAr : product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {language === 'ar' ? 'السعر: ' : 'Price: '}{product.price} 🪙
                            </span>
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {language === 'ar' ? 'التحميلات: ' : 'Downloads: '}{product.downloads || 0}
                            </span>
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {language === 'ar' ? 'التقييم: ' : 'Rating: '}{product.rating || 0} ⭐
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getStatusColor(product.approvalStatus)}`}>
                          {getStatusText(product.approvalStatus)}
                        </span>
                        <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          v{product.version}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {language === 'ar' ? 'نشر منتج جديد' : 'Submit New Product'}
            </h2>
            
            <form onSubmit={handleSubmitProduct} className={`p-6 rounded-xl ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-900 border border-gray-800'}`}>
              <div className="grid gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {language === 'ar' ? 'السعر (عملات)' : 'Price (coins)'}
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {language === 'ar' ? 'الفئة' : 'Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    >
                      <option value="themes">{language === 'ar' ? 'السمات' : 'Themes'}</option>
                      <option value="avatars">{language === 'ar' ? 'الصور الرمزية' : 'Avatars'}</option>
                      <option value="backgrounds">{language === 'ar' ? 'الخلفيات' : 'Backgrounds'}</option>
                      <option value="badges">{language === 'ar' ? 'الشارات' : 'Badges'}</option>
                      <option value="effects">{language === 'ar' ? 'التأثيرات' : 'Effects'}</option>
                      <option value="services">{language === 'ar' ? 'الخدمات' : 'Services'}</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {language === 'ar' ? 'الأيقونة (emoji)' : 'Icon (emoji)'}
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="🎨"
                      className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {language === 'ar' ? 'الندرة' : 'Rarity'}
                    </label>
                    <select
                      value={formData.rarity}
                      onChange={(e) => setFormData({ ...formData, rarity: e.target.value as any })}
                      className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    >
                      <option value="common">{language === 'ar' ? 'عادي' : 'Common'}</option>
                      <option value="rare">{language === 'ar' ? 'نادر' : 'Rare'}</option>
                      <option value="epic">{language === 'ar' ? 'أسطوري' : 'Epic'}</option>
                      <option value="legendary">{language === 'ar' ? 'ملحمي' : 'Legendary'}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'رابط GitHub (اختياري)' : 'GitHub URL (optional)'}
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'رابط التوثيق (اختياري)' : 'Documentation URL (optional)'}
                  </label>
                  <input
                    type="url"
                    value={formData.documentationUrl}
                    onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'الإصدار' : 'Version'}
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'نوع الكود' : 'Code Type'}
                  </label>
                  <select
                    value={formData.codeType}
                    onChange={(e) => setFormData({ ...formData, codeType: e.target.value as any })}
                    className={`w-full px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {language === 'ar' ? 'كود المنتج (اختياري)' : 'Product Code (optional)'}
                  </label>
                  <textarea
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    rows={10}
                    placeholder={language === 'ar' ? 'اكتب الكود هنا...' : 'Write your code here...'}
                    className={`w-full px-4 py-2 rounded-lg font-mono text-sm ${theme === 'light' ? 'bg-white border border-gray-300 text-gray-900' : 'bg-gray-800 border border-gray-700 text-white'}`}
                  />
                  <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'الكود سيُنفذ عند شراء المنتج. استخدم ProductAPI للتفاعل مع التطبيق.' : 'Code will be executed when product is purchased. Use ProductAPI to interact with the app.'}
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 rounded-lg font-bold ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  >
                    {language === 'ar' ? 'إرسال للمراجعة' : 'Submit for Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-3 rounded-lg font-medium ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="max-w-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {language === 'ar' ? 'الأرباح' : 'Earnings'}
            </h2>
            
            <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-900 border border-gray-800'}`}>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'إجمالي الأرباح' : 'Total Earnings'}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    0 🪙
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    0
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'نسبة العمولة' : 'Commission Rate'}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    70%
                  </p>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-800'}`}>
                <p className={`text-sm ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                  {language === 'ar' 
                    ? '💡 ستحصل على 70% من كل عملية بيع. سيتم تحديث الأرباح بعد الموافقة على منتجاتك وبدء المبيعات.'
                    : '💡 You will receive 70% of every sale. Earnings will be updated after your products are approved and sales begin.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </h2>
            
            <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-900 border border-gray-800'}`}>
              <div className="flex items-center gap-6 mb-6">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                    👤
                  </div>
                )}
                <div>
                  <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {currentUser.username}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'معرف المطور: ' : 'Developer ID: '}{currentUser.accountId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {products.length}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'المنتجات الموافق عليها' : 'Approved Products'}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {products.filter(p => p.approvalStatus === 'approved').length}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'إجمالي التحميلات' : 'Total Downloads'}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {products.reduce((sum, p) => sum + (p.downloads || 0), 0)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {products.length > 0 
                      ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
                      : '0.0'} ⭐
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-800'}`}>
                <p className={`text-sm ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                  {language === 'ar' 
                    ? '💡 نصيحة: للحصول على مزيد من المبيعات، تأكد من تحديث منتجاتك بانتظام والرد على تقييمات المستخدمين.'
                    : '💡 Tip: To get more sales, make sure to update your products regularly and respond to user reviews.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
