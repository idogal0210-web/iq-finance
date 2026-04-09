import { supabase } from './supabase';

export interface DbCategory { id: string; name: string; name_he: string | null; }
export interface DbSubcategory { id: string; category_id: string; name: string; name_he: string | null; is_recurring: boolean; }
export interface DbWallet { id: string; name: string; type: string; balance: number; currency: string; }
export interface DbTransaction {
  id: string; date: string; amount: number; currency: string; type: 'income' | 'expense';
  category_id: string | null; subcategory_id: string | null; wallet_id: string | null; description: string | null;
}

export async function fetchCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchSubcategories(): Promise<DbSubcategory[]> {
  const { data, error } = await supabase.from('subcategories').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchWallets(): Promise<DbWallet[]> {
  const { data, error } = await supabase.from('wallets').select('*').order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function fetchTransactions(): Promise<DbTransaction[]> {
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false }).limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function insertTransaction(tx: Omit<DbTransaction, 'id'>): Promise<DbTransaction> {
  const { data, error } = await supabase.from('transactions').insert(tx).select().single();
  if (error) throw error;
  return data;
}

export async function addCategory(name: string, name_he: string): Promise<DbCategory> {
  const { data, error } = await supabase.from('categories').insert({ name, name_he }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, name: string, name_he: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ name, name_he }).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function addSubcategory(category_id: string, name: string, name_he: string, is_recurring: boolean): Promise<DbSubcategory> {
  const { data, error } = await supabase.from('subcategories').insert({ category_id, name, name_he, is_recurring }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await supabase.from('subcategories').delete().eq('id', id);
  if (error) throw error;
}
