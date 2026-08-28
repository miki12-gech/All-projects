export const useTheme = () => {
    const isDark = useState('theme', () => false)

    const toggleTheme = () => {
        isDark.value = !isDark.value
        if (import.meta.client) {
            document.documentElement.classList.toggle('dark', isDark.value)
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        }
    }

    const initTheme = () => {
        if (import.meta.client) {
            const saved = localStorage.getItem('theme')
            // Default to light (false) unless saved as dark
            isDark.value = saved === 'dark'
            document.documentElement.classList.toggle('dark', isDark.value)
        }
    }

    return { isDark, toggleTheme, initTheme }
}
