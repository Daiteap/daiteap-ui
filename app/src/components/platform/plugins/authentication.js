import Vue from 'vue'
import Keycloak from 'keycloak-js'

const _keycloak = Keycloak('./keycloak.json')

const Plugin = {
    install(Vue) {
        Vue.$keycloak = _keycloak
    }
}

Plugin.install = Vue => {
    Vue.$keycloak = _keycloak
    Object.defineProperties(Vue.prototype, {
        $keycloak: {
            get() {
                return _keycloak
            }
        }
    })
}

Vue.use(Plugin)

export default Plugin