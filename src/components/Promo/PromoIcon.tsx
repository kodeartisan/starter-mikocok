// Contoh PromoIcon.tsx (setelah perubahan)
import { Icon } from '@iconify/react'
import { ThemeIcon } from '@mantine/core'

const PromoIcon = ({ size, icon, gradient }) => {
  // Tambahkan 'gradient' ke props
  return (
    <ThemeIcon
      size={size}
      radius="xl"
      variant="gradient"
      gradient={gradient || { from: 'blue', to: 'cyan' }}
    >
      {' '}
      {/* Gunakan gradient yang diteruskan, atau default */}
      <Icon icon={icon} fontSize={size * 0.7} />
    </ThemeIcon>
  )
}

export default PromoIcon
