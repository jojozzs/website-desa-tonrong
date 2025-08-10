// components/MainPage/SambutanKades.tsx
'use client'

import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function SambutanKades() {
  return (
    <section className="w-full ">
      <div className="max-w-7xl mx-auto">
    
        {/* Main Content: Text Kiri + Foto Kanan */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Sambutan Text - Kiri */}
          <div className="space-y-6">
            
            {/* Opening Quote */}
            <div className="relative">
              <div className="ml-2 text-6xl text-primary-orange/20 font-serif absolute -top-4 -left-4">"</div>
              <blockquote className="text-xl lg:text-2xl font-medium text-text-primary leading-relaxed italic pl-8">
                Assalamu'alaikum warahmatullahi wabarakatuh
              </blockquote>
            </div>

            {/* Main Message */}
            <div className="space-y-4 text-justify">
              <p className="text-lg text-text-secondary leading-relaxed">
                Selamat datang di website resmi Desa Tonrong. Melalui platform digital ini, 
                kami berkomitmen untuk memberikan pelayanan terbaik dan informasi yang transparan 
                kepada seluruh masyarakat desa.
              </p>
              
              <p className="text-lg text-text-secondary leading-relaxed">
                Desa Tonrong terus berbenah menuju era digitalisasi dengan tetap menjunjung 
                tinggi nilai-nilai kearifan lokal dan gotong royong. Bersama-sama, mari kita 
                membangun desa yang maju, sejahtera, dan berkelanjutan untuk generasi mendatang.
              </p>

            </div>

            {/* Vision Statement */}
            <div className="bg-white rounded-2xl p-4 border-l-4 border-primary-orange shadow-sm">
              <h4 className="font-bold text-text-primary mb-3 text-lg">Visi Kami:</h4>
              <p className="text-text-secondary leading-relaxed text-justify">
                "Mewujudkan Desa Tonrong yang mandiri, sejahtera, dan berkeadilan 
                berbasis teknologi dengan tetap melestarikan nilai-nilai budaya lokal."
              </p>
            </div>

          </div>

          {/* Foto Kepala Desa */}
          <div className="relative group">
            
            {/* Main Photo */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="profile.png" 
                alt="H. Ahmad Syahrul, S.Pd - Kepala Desa Tonrong"
                className="w-full h-[500px] lg:h-[430px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Name Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-bold text-text-primary mb-1">H. Ahmad Syahrul, S.Pd</h4>
                  <p className="text-text-secondary text-sm">Kepala Desa Tonrong</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-primary-green rounded-full mr-2"></div>
                    <span className="text-xs text-text-muted">Periode 2019 - 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Frame */}
            <div className="absolute -inset-4 border-2 border-primary-orange/20 rounded-2xl -z-10"></div>

            {/* Background Decorations */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary-orange/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-green/10 rounded-full blur-xl"></div>
          </div>

        </div>
      </div>
    </section>
  )
}