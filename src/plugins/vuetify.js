import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#E195AB', // สีหลัก
                secondary: '#424242', // สีรอง
                accent: '#82B1FF', // สีเสริม
                error: '#FF5252', // สีสำหรับข้อผิดพลาด
                info: '#2196F3', // สีสำหรับข้อมูล
                success: '#4CAF50', // สีสำหรับความสำเร็จ
                warning: '#FFC107', // สีสำหรับคำเตือน
            },
        },
    },
});
