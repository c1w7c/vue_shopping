<template>
    <div>
        <Navbar/>
        <Alert/>
        <div class="container-fluid">
            <div class="row">
                <Sidebar/>
                <main class="col-md-9 ml-sm-auto col-lg-10 px-4 pt-5">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Alert from './AlertMessage';

export default {
    components:{
        Sidebar,
        Navbar,
        Alert,
    },
    created(){
        var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        this.$http.defaults.headers.common.Authorization = myCookie;
    }
}

</script>