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
                className="w-full h-80 lg:h-100 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-orange/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-green/20 rounded-full blur-xl"></div>
          </div>

          {/* Deskripsi*/}
          <div className="space-y-6">
            <div className="w-full lg:h-100 h-80">
              <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-6">
                Tentang Desa Tonrong Rijang
              </h3>
              
              <div className="space-y-4 text-justify">
                <p className="text-lg text-text-secondary leading-relaxed">
                  Desa Tonrong Rijang terletak di Kecamatan Baranti, Kabupaten Sidenreng Rappang, Sulawesi Selatan. 
                </p>
                
                <p className="text-lg text-text-secondary leading-relaxed">
                  Sebagai salah satu desa maju di wilayah ini, Tonrong Rijang terus berupaya meningkatkan pelayanan, kesejahteraan, 
                  dan partisipasi masyarakat dalam pembangunan desa.
                </p>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}