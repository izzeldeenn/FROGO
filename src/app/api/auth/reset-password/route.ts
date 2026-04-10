import { NextRequest, NextResponse } from 'next/server';
import { resetTokenDB, userDB } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Find valid token
    const resetTokenData = await resetTokenDB.findTokenByToken(token);
    if (!resetTokenData) {
      return NextResponse.json(
        { success: false, error: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await userDB.getUserByEmail(resetTokenData.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Hash new password
    const { hashPassword } = await import('@/utils/password');
    const hashedPassword = await hashPassword(password);

    // Update user password
    const updateResult = await userDB.updateUserByAccountId(user.account_id, {
      password: hashedPassword
    });

    if (!updateResult) {
      return NextResponse.json(
        { success: false, error: 'فشل تحديث كلمة المرور' },
        { status: 500 }
      );
    }

    // Mark token as used
    await resetTokenDB.markTokenAsUsed(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل إعادة تعيين كلمة المرور' },
      { status: 500 }
    );
  }
}
