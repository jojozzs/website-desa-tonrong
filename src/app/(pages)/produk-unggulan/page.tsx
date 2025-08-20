// app/(pages)/produk-unggulan/page.tsx

import ProdukUnggulanClient from '@/components/ProdukUnggulan/ProdukUnggulanClient'

export const dynamic = 'force-static'

export default function ProdukUnggulanPage() {
  return <ProdukUnggulanClient />
}