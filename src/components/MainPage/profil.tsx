// components/MainPage/ProfilDesa.tsx
'use client'

export default function ProfilDesa() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto">

        {/* Main Content: Foto Kiri + Deskripsi Kanan */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Foto Desa */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="landscape.jpg" 
                alt="Foto Desa Tonrong"
                className="w-full h-80 lg:h-120 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-orange/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-green/20 rounded-full blur-xl"></div>
          </div>

          {/* Deskripsi - Kanan */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-6">
                Desa yang Kaya akan Potensi
              </h3>
              
              <div className="space-y-4 text-justify">
                <p className="text-lg text-text-secondary leading-relaxed">
                  Desa Tonrong merupakan salah satu desa di Kecamatan Bone, Kabupaten Bone, 
                  Sulawesi Selatan yang memiliki potensi alam dan sumber daya manusia yang luar biasa.
                </p>
                
                <p className="text-lg text-text-secondary leading-relaxed">
                  Dengan luas wilayah yang strategis dan penduduk yang ramah, desa ini terus berkembang 
                  menuju modernisasi tanpa meninggalkan nilai-nilai tradisional yang telah mengakar 
                  dalam kehidupan bermasyarakat.
                </p>
                
                <p className="text-lg text-text-secondary leading-relaxed">
                  Desa Tonrong terdiri dari 8 dusun dengan total penduduk 2,547 jiwa yang hidup 
                  rukun dan penuh semangat gotong royong. Berbagai potensi ekonomi terus dikembangkan 
                  melalui 25 UMKM aktif yang menjadi tulang punggung perekonomian desa.
                </p>
                
                <p className="text-lg text-text-secondary leading-relaxed">
                  Komitmen terhadap transparansi dan pelayanan prima menjadikan Desa Tonrong 
                  sebagai contoh desa modern yang tetap menjunjung tinggi kearifan lokal dan 
                  nilai-nilai budaya Sulawesi Selatan.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}