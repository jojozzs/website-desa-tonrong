// components/Footer.tsx
'use client'

import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-text-primary text-white">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 pb-4 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Section 1: Brand & Desa Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Tentang Desa</h3>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-orange to-primary-green rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">DT</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  Desa<br />
                  Tonrong
                </h2>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              Portal resmi Desa Tonrong untuk transparansi informasi dan pelayanan masyarakat.
            </p>
            
            <div className="text-sm text-gray-400">
              <p className="font-medium text-primary-orange mb-1">Pemerintah Desa Tonrong</p>
              <p>Kecamatan Bone, Kabupaten Bone</p>
              <p>Provinsi Sulawesi Selatan</p>
            </div>
          </div>

          {/* Section 2: Alamat */}
        <div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MapPinIcon className="w-5 h-5 text-primary-orange mr-2" />
                    Alamat Kantor
                </h3>
            
                <div className="space-y-3 text-gray-300">
                    <div className='font-semibold'>
                        <p className="text-sm">Jl. Raya Desa Tonrong No. 123</p>
                        <p className="text-sm">Desa Tonrong, Kec. Bone</p>
                        <p className="text-sm">Kab. Bone, Sulawesi Selatan</p>
                        <p className="text-sm">Kode Pos: 92714</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <ClockIcon className="w-4 h-4 text-primary-green mr-2 flex-shrink-0" />
                  Jam Pelayanan
                </h3>
                <div className='space-y-2'>
                    <p className='text-sm'>Senin - Jumat: 08:00 - 16:00 WITA</p>
                    <p className='text-sm'> Sabtu: 08:00 - 12:00 WITA</p>
                    <p className="text-gray-400 text-sm">Minggu & Hari Libur: Tutup</p>
                </div>
            </div>
        </div>

          {/* Section 3: Kontak */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <PhoneIcon className="w-5 h-5 text-primary-green mr-2" />
              Hubungi Kami
            </h3>
            
            <div className="space-y-2 text-gray-300">
              <div>
                <p className="font-bold mb-2">Nomor Telepon:</p>
                <div className="space-y-2">
                  <p>
                    <a href="tel:+6281234567890" className="hover:text-primary-green transition-colors flex items-center text-sm">
                      <span className="mr-2">📱</span>
                      +62 812-3456-7890 (WhatsApp)
                    </a>
                  </p>
                  <p>
                    <a href="tel:+62411123456" className="hover:text-primary-green transition-colors flex items-center text-sm">
                      <span className="mr-2">☎️</span>
                      (0411) 123-456 (Kantor)
                    </a>
                  </p>
                </div>
              </div>

              <div className='mt-8'>
                <p className="font-bold mb-2 flex items-center">
                  Email:
                </p>
                <div className="space-y-1">
                  <p>
                    <a href="mailto:info@desatonrong.id" className="hover:text-primary-orange transition-colors text-sm">
                      info@desatonrong.id
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Map & Lokasi */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-1 text-primary-orange" />
              Lokasi Desa
            </h3>
            
            {/* Map */}
            <div className="relative rounded-lg overflow-hidden shadow-lg mb-4">
              <div className="aspect-[4/3] bg-gray-600 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.60901665353!2d120.0!3d-4.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzAnMDAuMCJTIDEyMMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sid!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                  title="Lokasi Desa Tonrong"
                ></iframe>
                
                {/* Map Label */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                  <p className="text-text-primary text-xs font-bold">📍 Desa Tonrong</p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <a 
                href="https://maps.google.com/?q=-4.5,120.0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-orange hover:text-primary-green transition-colors font-medium"
              >
                <MapPinIcon className="w-4 h-4 mr-1" />
                Buka di Google Maps
              </a>
              
              <div className="text-gray-400">
                <p>• 15 km dari pusat Kota Bone</p>
                <p>• 45 menit berkendara dari Watampone</p>
                <p>• Akses jalan aspal kondisi baik</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 ">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Pemerintah Desa Tonrong. Semua hak dilindungi undang-undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}   