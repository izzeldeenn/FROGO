import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key if available, otherwise fall back to anon key
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET - Fetch a single developer product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseService
      .from('developer_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching developer product:', error);
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error('Error in GET /api/developer-products/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update a developer product (for approval/rejection)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('PATCH request for product ID:', id);
    console.log('Update data:', body);
    
    // First, check if product exists
    const { data: existingProduct, error: fetchError } = await supabaseService
      .from('developer_products')
      .select('*')
      .eq('id', id);

    console.log('Existing product:', existingProduct);
    console.log('Fetch error:', fetchError);

    if (fetchError || !existingProduct || existingProduct.length === 0) {
      console.error('Product not found:', fetchError);
      // Log all products in the table for debugging
      const { data: allProducts } = await supabaseService
        .from('developer_products')
        .select('*');
      console.log('All products in table:', allProducts);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = existingProduct[0];
    
    const {
      approval_status,
      approved_by,
      rejection_reason
    } = body;

    const updateData: any = {};

    if (approval_status !== undefined) {
      updateData.approval_status = approval_status;
    }
    if (approved_by !== undefined) {
      updateData.approved_by = approved_by;
    }
    if (rejection_reason !== undefined) {
      updateData.rejection_reason = rejection_reason;
    }

    if (approval_status === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }

    console.log('Update object:', updateData);

    const { data, error } = await supabaseService
      .from('developer_products')
      .update(updateData)
      .eq('id', id)
      .select();

    console.log('Update result:', { data, error });

    if (error) {
      console.error('Error updating developer product:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('No rows returned from update');
      // Fetch the updated product to confirm the update
      const { data: updatedProduct, error: fetchUpdatedError } = await supabaseService
        .from('developer_products')
        .select('*')
        .eq('id', id);
      
      console.log('Updated product after fetch:', updatedProduct);
      
      if (fetchUpdatedError || !updatedProduct || updatedProduct.length === 0) {
        return NextResponse.json({ product: product });
      }
      
      return NextResponse.json({ product: updatedProduct[0] });
    }

    return NextResponse.json({ product: data[0] });
  } catch (error) {
    console.error('Error in PATCH /api/developer-products/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a developer product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabaseService
      .from('developer_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting developer product:', error);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/developer-products/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
