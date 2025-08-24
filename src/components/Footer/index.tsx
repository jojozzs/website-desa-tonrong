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
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 pb-4 pt-12 max-w-8xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Section 1: Brand & Desa Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-semibold text-white mb-4">Tentang Desa</h3>

            <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-3xl font-bold text-white leading-tight">
                  Desa<br />
                  Tonrong Rijang
                </h2>
            </div>

            {/* Redesigned Logo Section */}
            <div className="grid grid-cols-3 gap-4 pt-2 pb-6">
                <div className='flex items-center justify-center rounded-2xl transition-all duration-300 group'>
                    <img
                        src="/logokkn.png" 
                        alt="Logo KKN Universitas Hasanuddin"
                        className="w-18 h-18 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                <div className='flex items-center justify-center rounded-2xl transition-all duration-300 group'>
                    <img
                        src="/logokkntonrongrijang.png" 
                        alt="Logo KKN Desa Tonrong Rijang Universitas Hasanuddin"
                        className="w-18 h-18 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                <div className='flex items-center justify-center rounded-2xl transition-all duration-300 group'>
                    <img
                        src="/kabupatensidrap.png" 
                        alt="Logo Kabupaten Sidrap"
                        className="w-18 h-18 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
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
                    <div className='font-medium'>
                        <p className="text-sm">Jl. Jeruk No. 3, Dusun Tonrong Rijang</p>
                        <p className="text-sm">Desa Tonrong, Kec. Baranti</p>
                        <p className="text-sm">Kab. Sidenreng Rappang, Sulawesi Selatan</p>
                        <p className="text-sm">Kode Pos: 91652</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mt-4 mb-4 flex items-center">
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
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <PhoneIcon className="w-5 h-5 text-primary-green mr-2" />
              Hubungi Kami
            </h3>
            
            <div className="space-y-2 text-gray-300">
              <div>
                <p className="font-bold mb-2 ">Nomor Telepon:</p>
                <div className="space-y-2">
                  <p>
                      <span className="mr-2">📱</span>
                      085299772547
                  </p>
                </div>
              </div>

              <div className='mt-8'>
                <p className="font-bold mb-2 flex items-center">
                  Email:
                </p>
                <div className="space-y-1">
                  <p className='flex items-center'>
                    <EnvelopeIcon className="w-5 h-5 text-primary-green mr-2" />
                    desatonrongrijang@gmail.com
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15924.075761204782!2d119.76999704999999!3d-3.8059839999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d944ab93675d953%3A0x584e7ba49a51ae2b!2sTonrong%20Rijang%2C%20Baranti%2C%20Sidenreng%20Rappang%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1755363757126!5m2!1sen!2sid"
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
                  <p className="text-text-primary text-xs font-bold">📍 Desa Tonrong Rijang</p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <a 
                href="https://maps.app.goo.gl/EruJ3Jpohjr6Co1J6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-orange hover:text-primary-green transition-colors font-medium"
              >
                <MapPinIcon className="w-4 h-4 mr-1" />
                Buka di Google Maps
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 ">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 KKN Desa Tonrong Rijang Universitas Hasannuddin. Semua hak dilindungi undang-undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}