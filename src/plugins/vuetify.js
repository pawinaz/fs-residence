import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#3D8D7A', 
                secondary: '#768578', 
                accent: '#C0717C', 
                error: '#FF5252', 
                info: '#2196F3', 
                success: '#4CAF50', 
                warning: '#FFC107', 
            },

        },
    },
});
