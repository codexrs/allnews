
const sStorage = window.sessionStorage
export default {
    getItem(key) {
        try {
            return JSON.parse(sStorage.getItem(key))
        } catch(err) {
            return null
        }
    },
    setItem(key, val) {
        sStorage.setItem(key,JSON.stringify(val))
    },
    clear() {
        sStorage.clear()
    },
    removeItem(key) {
        sStorage.removeItem(key)
    }
}