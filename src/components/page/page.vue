<template>
   <nav>
        <ul class="pagination justify-content-center">
            <li class="page-item" :class="{disabled:!pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent='getProduct(pagination.current_page - 1)'>
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            <li class="page-item" v-for='page in pagination.total_pages' :key='page' :class="{active:(page === pagination.current_page)}">
                <a class="page-link" href="#" @click.prevent='getProduct(page)'>{{page}}</a>
            </li>
            <li class="page-item" :class="{disabled:!pagination.has_next}">
            <a class="page-link" href="#" @click.prevent='getProduct(pagination.current_page + 1)'>
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default{
        data:function(){
            return {
                pagination:{},
                parentApiName:'',
            }
        },
        methods: {
            getProduct(page = 1){
                let vm = this;
                this.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/${vm.parentApiName}?page=${page}`).then((response) => {
                this.pagination = response.data.pagination;
                console.log(response);
                vm.$bus.$emit('page:fire',page);
                })  
            }
        },
        // created() {
        //     this.getProduct();
        // },
    }
</script>

<style>


</style>