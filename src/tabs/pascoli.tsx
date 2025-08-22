import ModulePascoli from '@mellowtel/module-pascoli'
import { useEffect } from 'react'

function PascoliPage() {
  useEffect(() => {
    const initPascoli = async () => {
      const modulePascoli = new ModulePascoli()
      await modulePascoli.init()
    }

    initPascoli().catch(console.error)
  }, [])

  return (
    <div
      style={{
        padding: 0,
        margin: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    ></div>
  )
}

export default PascoliPage
