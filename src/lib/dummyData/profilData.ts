import { ProfilKategoriEnum } from '../enums'

export const DUMMY_PROFIL_DATA = {
  // Profil Overview (umum)
  umum: [
    {
      id: 'profil-umum-1',
      judul: 'Profil Desa Tonrong Rijang',
      deskripsi: 'Desa Tonrong Rijang adalah sebuah desa yang terletak di Kecamatan Baranti, Kabupaten Sidenreng Rappang, Sulawesi Selatan',
      kategori: 'umum' as any,
      gambar_url: '/landscape.jpg',
      gambar_id: 'dummy_gambar_1',
      gambar_size: 1024000,
      gambar_type: 'jpg',
      gambar_width: 1200,
      gambar_height: 800,
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: 'admin_dummy',
      konten: `
        <p>Desa Tonrong Rijang merupakan salah satu desa di Kecamatan Baranti yang memiliki potensi alam dan sumber daya manusia yang luar biasa. Dengan luas wilayah 340 Ha, desa ini menjadi rumah bagi 1.458 jiwa penduduk yang hidup rukun dan harmonis.</p>
        
        <p>Sebagai desa yang terus berkembang, Tonrong Rijang berkomitmen untuk meningkatkan kesejahteraan masyarakat melalui berbagai program pembangunan yang berkelanjutan. Desa ini memiliki visi untuk menjadi desa yang maju, mandiri, dan sejahtera berbasis pertanian dan kebersamaan.</p>
        
        <p>Dengan mayoritas penduduk bermata pencaharian sebagai petani (33%), desa ini memiliki potensi besar di bidang pertanian dan perkebunan. Selain itu, keberadaan BUMDes Harapan Makmur turut mendukung perekonomian desa melalui berbagai unit usaha.</p>
      `,
      data_tambahan: {
        info_singkat: {
          luas_wilayah: '340 Ha',
          total_penduduk: 1458,
          total_kk: 463,
          status_idm: 'Desa Maju',
          nilai_idm: '0,7206'
        }
      }
    }
  ],

  // Sejarah
  [ProfilKategoriEnum.SEJARAH]: [
    {
      id: 'sejarah-1',
      judul: 'Sejarah Desa Tonrong Rijang',
      deskripsi: 'Perjalanan panjang pembentukan dan perkembangan Desa Tonrong Rijang dari masa ke masa',
      kategori: ProfilKategoriEnum.SEJARAH,
      gambar_url: '/landscape.jpg',
      gambar_id: 'sejarah_gambar_1',
      gambar_size: 1024000,
      gambar_type: 'jpg',
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: 'admin_dummy',
      konten: `
        <h2>Awal Pembentukan Desa</h2>
        <p>Desa Tonrong Rijang merupakan desa termuda di Kecamatan Baranti. Awalnya merupakan bagian dari Desa Tonronge, kemudian dimekarkan menjadi desa persiapan pada tahun 1996. Proses pemekaran ini dilakukan untuk memberikan pelayanan yang lebih optimal kepada masyarakat.</p>
        
        <h3>Penetapan Sebagai Desa Definitif</h3>
        <p>Setelah melalui proses panjang administrasi dan pemenuhan syarat-syarat sebagai desa definitif, pada tanggal 17 Maret 2003 berdasarkan Keputusan Bupati Sidenreng Rappang Nomor 116 Tahun 2003, Desa Tonrong Rijang resmi ditetapkan sebagai desa definitif dan bergabung kembali dengan Kecamatan Baranti hingga saat ini.</p>
        
        <h3>Perkembangan Modern</h3>
        <p>Sejak ditetapkan sebagai desa definitif, Tonrong Rijang terus mengalami perkembangan pesat. Pembangunan infrastruktur, peningkatan pelayanan publik, dan pemberdayaan masyarakat menjadi fokus utama pemerintah desa dalam mencapai visi menjadi desa yang maju dan sejahtera.</p>
      `,
      data_tambahan: {}
    }
  ],

  // Visi Misi
  [ProfilKategoriEnum.VISI_DAN_MISI]: [
    {
      id: 'visi-misi-1',
      judul: 'Visi & Misi Desa Tonrong Rijang',
      deskripsi: 'Arah dan tujuan pembangunan desa untuk mewujudkan masyarakat yang sejahtera',
      kategori: ProfilKategoriEnum.VISI_DAN_MISI,
      gambar_url: '/landscape.jpg',
      gambar_id: 'visi_misi_gambar_1',
      gambar_size: 1024000,
      gambar_type: 'jpg',
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: 'admin_dummy',
      konten: `
        <p>Visi dan misi Desa Tonrong Rijang disusun berdasarkan aspirasi masyarakat dan kondisi objektif desa. Melalui proses musyawarah desa yang melibatkan seluruh stakeholder, visi dan misi ini menjadi panduan dalam setiap kebijakan dan program pembangunan.</p>
      `,
      data_tambahan: {
        visi: "Mewujudkan Desa Tonrong Rijang yang Maju, Mandiri, dan Sejahtera Berbasis Pertanian dan Kebersamaan.",
        misi: [
          "Meningkatkan kualitas SDM melalui pendidikan dan pelatihan.",
          "Mengembangkan potensi pertanian, perkebunan, dan UMKM.",
          "Memperkuat infrastruktur desa demi kelancaran ekonomi dan pelayanan publik.",
          "Mendorong partisipasi masyarakat dalam pembangunan.",
          "Menjaga kelestarian lingkungan dan nilai-nilai gotong royong."
        ]
      }
    }
  ],

  // Letak Geografis
  [ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA]: [
    {
      id: 'geografis-1',
      judul: 'Letak Geografis & Peta Desa',
      deskripsi: 'Posisi strategis dan batas wilayah Desa Tonrong Rijang',
      kategori: ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA,
      gambar_url: '/landscape.jpg',
      gambar_id: 'geografis_gambar_1',
      gambar_size: 1024000,
      gambar_type: 'jpg',
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: 'admin_dummy',
      konten: `
        <p>Desa Tonrong Rijang memiliki posisi geografis yang strategis dengan akses yang mudah ke berbagai fasilitas umum. Kondisi topografi yang relatif datar menjadikan desa ini cocok untuk pengembangan berbagai aktivitas ekonomi, khususnya pertanian.</p>
      `,
      data_tambahan: {
        informasi_wilayah: {
          luas_wilayah: "340 Ha",
          kecamatan: "Baranti",
          kabupaten: "Sidenreng Rappang",
          provinsi: "Sulawesi Selatan",
          kode_pos: "91652"
        },
        koordinat: {
          latitude: "-4.2°S",
          longitude: "119.6°E",
          ketinggian: "±50 mdpl",
          topografi: "Dataran rendah"
        },
        batas_wilayah: {
          utara: "Desa Abbokongan (Kec. Kulo)",
          selatan: "Desa Tonronge (Kec. Baranti)",
          timur: "Kel. Duampanua (Kec. Baranti) & Desa Rijang Panua (Kec. Kulo)",
          barat: "Kel. Samaturue (Kec. Tiroang, Kab. Pinrang)"
        }
      }
    }
  ],

  // Struktur Pemerintahan
  [ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA]: [
    {
      id: 'struktur-1',
      judul: 'Struktur Pemerintahan Desa',
      deskripsi: 'Susunan organisasi dan perangkat Desa Tonrong Rijang',
      kategori: ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA,
      gambar_url: '/landscape.jpg',
      gambar_id: 'struktur_gambar_1',
      gambar_size: 1024000,
      gambar_type: 'jpg',
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: 'admin_dummy',
      konten: `
        <p>Struktur pemerintahan Desa Tonrong Rijang disusun berdasarkan peraturan perundang-undangan yang berlaku. Setiap unsur dalam struktur memiliki tugas dan fungsi yang spesifik untuk melayani masyarakat dengan optimal.</p>
      `,
      data_tambahan: {
        pimpinan: [
          {
            nama: "Haedar",
            jabatan: "Kepala Desa",
            foto: null,
            periode: "2019-2025"
          },
          {
            nama: "Jusman",
            jabatan: "Sekretaris Desa",
            foto: null,
            periode: "2020-2026"
          }
        ],
        perangkat: [
          { jabatan: "Kaur Tata Usaha dan Umum", nama: "-" },
          { jabatan: "Kaur Keuangan", nama: "-" },
          { jabatan: "Kaur Perencanaan", nama: "-" },
          { jabatan: "Kasi Pemerintahan", nama: "-" },
          { jabatan: "Kasi Kesejahteraan", nama: "-" },
          { jabatan: "Kasi Pelayanan", nama: "-" }
        ],
        tugas_fungsi: [
          {
            jabatan: "Kepala Desa",
            deskripsi: "Memimpin penyelenggaraan pemerintahan desa, pembangunan desa, pembinaan kemasyarakatan, dan pemberdayaan masyarakat desa."
          },
          {
            jabatan: "Sekretaris Desa",
            deskripsi: "Membantu Kepala Desa dalam melaksanakan tugas dan fungsinya, serta menjalankan tugas administrasi pemerintahan desa."
          },
          {
            jabatan: "Perangkat Desa",
            deskripsi: "Membantu Kepala Desa dalam melaksanakan tugas dan fungsinya sesuai dengan bidang tugasnya masing-masing."
          }
        ]
      }
    }
  ],

  // Data Penduduk
  [ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM]: [
    {
      id: 'penduduk-1',
      judul: 'Jumlah Penduduk & Data Umum',
      deskripsi: 'Informasi demografi dan karakteristik penduduk Desa Tonrong Rijang',
      kategori: ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM,
      gambar_url: '/landscape.jpg',
      gambar_id: 'penduduk_gambar_1',
      gambar_size: 1024000,
      gambar_type: 'jpg',
      created_at: new Date(),
      updated_at: new Date(),
      admin_id: 'admin_dummy',
      konten: `
        <p>Data kependudukan Desa Tonrong Rijang menunjukkan komposisi penduduk yang seimbang dengan mayoritas berada pada usia produktif. Hal ini menjadi modal penting dalam pembangunan desa ke depan.</p>
      `,
      data_tambahan: {
        demografi: {
          total_penduduk: 1458,
          total_kk: 463,
          laki_laki: 728,
          perempuan: 730
        },
        mata_pencaharian: [
          { kategori: "Petani", persen: 33, jumlah: 481 },
          { kategori: "Ibu Rumah Tangga", persen: 25, jumlah: 365 },
          { kategori: "Pelajar/Mahasiswa", persen: 12, jumlah: 175 },
          { kategori: "Buruh", persen: 10, jumlah: 146 },
          { kategori: "Wiraswasta", persen: 8, jumlah: 117 },
          { kategori: "PNS", persen: 5, jumlah: 73 },
          { kategori: "Lainnya", persen: 7, jumlah: 101 }
        ],
        kelompok_umur: [
          { kelompok: "0-14 tahun", jumlah: 380, persen: 26 },
          { kelompok: "15-64 tahun", jumlah: 962, persen: 66 },
          { kelompok: "65+ tahun", jumlah: 116, persen: 8 }
        ],
        agama: {
          islam: { persentase: 100, jumlah: 1458 }
        },
        idm: {
          nilai: "0,7206",
          status: "Desa Maju",
          deskripsi: "Desa Tonrong Rijang termasuk dalam kategori Desa Maju berdasarkan Indeks Desa Membangun"
        }
      }
    }
  ]
}