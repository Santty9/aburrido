import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const changelogs = [
  {
    title: '🚀 Lanzamiento de Aburrido',
    content: 'Bienvenido a **Aburrido** — la forma más elegante de compartir tus links.\n\n## Features\n- Perfil público personalizable\n- Drag & drop para organizar links\n- 8 temas visuales únicos\n- Analytics en tiempo real\n- Modo oscuro/light\n\n## Próximamente\n- Pago premium con Stripe\n- Temas exclusivos premium\n- Personalización CSS avanzada',
    version: '1.0.0',
    type: 'feature' as const,
    is_premium: false,
  },
  {
    title: '🎨 Temas Premium',
    content: 'Añadidos **temas exclusivos** para usuarios premium:\n\n- **Cyberpunk** — Colores neón vibrantes\n- **Sunset** — Degradado atardecer\n- **Ocean** — Azul profundo\n- **Glassmorphism** — Efecto cristal\n\nAdemás, ahora puedes personalizar colores individuales en cualquier tema.',
    version: '1.1.0',
    type: 'feature' as const,
    is_premium: true,
  },
  {
    title: '🐛 Fix: Analytics incorrectos',
    content: 'Corregido un bug donde los analytics mostraban conteos duplicados en visitas. Ahora los datos son precisos y en tiempo real.',
    version: '1.1.1',
    type: 'fix' as const,
    is_premium: false,
  },
  {
    title: '⚡ Mejora de rendimiento',
    content: 'Optimizaciones significativas:\n\n- Carga de perfiles 60% más rápida\n- Imágenes optimizadas con lazy loading\n- Reducción de bundle size\n- Mejora en animaciones y transiciones',
    version: '1.2.0',
    type: 'improvement' as const,
    is_premium: false,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  for (const changelog of changelogs) {
    await prisma.changelog.create({ data: changelog })
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
