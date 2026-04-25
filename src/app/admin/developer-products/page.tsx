'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { StoreItem } from '@/components/store/storeProducts';

export default function DeveloperProductsAdmin() {
  const { currentAdmin, isLoggedIn, isLoading } = useAdmin();
  const router = useRouter();
  const [products, setProducts] = useState<StoreItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/admin-auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    loadDeveloperProducts();
  }, []);

  const loadDeveloperProducts = async () => {
    try {
      const response = await fetch('/api/developer-products');
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
          developerName: 'Developer',
          developerAvatar: '',
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
      console.error('Failed to load developer products:', error);
    }
  };

  const approveProduct = async (product: StoreItem) => {
    if (!product.developerId) return;

    try {
      const response = await fetch(`/api/developer-products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approval_status: 'approved',
          approved_by: currentAdmin?.id
        }),
      });

      if (response.ok) {
        await loadDeveloperProducts();
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const rejectProduct = async () => {
    if (!selectedProduct || !selectedProduct.developerId) return;

    try {
      const response = await fetch(`/api/developer-products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approval_status: 'rejected',
          approved_by: currentAdmin?.id,
          rejection_reason: rejectionReason
        }),
      });

      if (response.ok) {
        await loadDeveloperProducts();
        setSelectedProduct(null);
        setShowRejectModal(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.approvalStatus === filter;
  });

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
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn || !currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Developer Products</h1>
            <p className="text-gray-400 text-sm">
              Review and approve developer products
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 border-b border-gray-800">
            <div className="flex gap-8">
              <button
                onClick={() => setFilter('all')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  filter === 'all'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  filter === 'pending'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Pending ({products.filter(p => p.approvalStatus === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  filter === 'approved'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Approved ({products.filter(p => p.approvalStatus === 'approved').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  filter === 'rejected'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Rejected ({products.filter(p => p.approvalStatus === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl">
              <p className="text-lg text-gray-300">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-6 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{product.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">
                            {product.name}
                          </h3>
                          <span className={`text-sm font-medium ${getStatusColor(product.approvalStatus)}`}>
                            {getStatusText(product.approvalStatus)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-300">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-400">
                            Developer: {product.developerName}
                          </span>
                          <span className="text-gray-400">
                            Category: {product.category}
                          </span>
                          <span className="text-gray-400">
                            Price: {product.price} 🪙
                          </span>
                          <span className="text-gray-400">
                            Version: {product.version}
                          </span>
                        </div>
                        {product.githubUrl && (
                          <a
                            href={product.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-sm text-blue-400 hover:text-blue-300"
                          >
                            GitHub Repository
                          </a>
                        )}
                        {product.documentationUrl && (
                          <a
                            href={product.documentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 ml-4 text-sm text-blue-400 hover:text-blue-300"
                          >
                            Documentation
                          </a>
                        )}
                        {product.rejectionReason && (
                          <div className="mt-2 p-3 rounded-lg bg-red-900/30 border border-red-800">
                            <p className="text-sm text-red-300">
                              <span className="font-bold">Rejection Reason: </span>
                              {product.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {product.approvalStatus === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveProduct(product)}
                          className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[10000]">
          <div className="w-full max-w-md rounded-xl p-6 shadow-2xl bg-gray-800">
            <h3 className="text-xl font-bold mb-4 text-white">
              Reject Product
            </h3>
            <p className="mb-4 text-gray-300">
              Please enter the reason for rejecting this product:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg mb-4 bg-gray-700 border border-gray-600 text-white"
              placeholder="Rejection reason..."
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (rejectionReason.trim()) {
                    rejectProduct();
                  }
                }}
                disabled={!rejectionReason.trim()}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  rejectionReason.trim()
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedProduct(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
