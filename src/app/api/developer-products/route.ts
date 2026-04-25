import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key if available, otherwise fall back to anon key
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// GET - Fetch all developer products (for admins) or user's products (for developers)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('developerId');
    const status = searchParams.get('status');

    let query = supabaseService.from('developer_products').select('*');

    if (developerId) {
      query = query.eq('developer_id', developerId);
    }

    if (status) {
      query = query.eq('approval_status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching developer products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (error) {
    console.error('Error in GET /api/developer-products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new developer product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      developer_id,
      name,
      name_ar,
      description,
      description_ar,
      price,
      category,
      icon,
      rarity,
      github_url,
      documentation_url,
      version,
      code,
      code_type,
      sandbox_config
    } = body;

    // Validate required fields
    if (!developer_id || !name || !name_ar || !description || !description_ar || !price || !category || !icon || !rarity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseService
      .from('developer_products')
      .insert({
        developer_id,
        name,
        name_ar,
        description,
        description_ar,
        price,
        category,
        icon,
        rarity,
        github_url: github_url || null,
        documentation_url: documentation_url || null,
        version: version || '1.0.0',
        code: code || null,
        code_type: code_type || 'javascript',
        code_version: version || '1.0.0',
        sandbox_config: sandbox_config || {},
        approval_status: 'pending',
        downloads: 0,
        rating: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating developer product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/developer-products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
