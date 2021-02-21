<template>
    <div>
        <loading :active.sync="isLoading" loader='dots'>
        </loading>
        <div class='text-right my-2'>
            <button class='btn btn-outline-info' @click='newOrEditProductModal(true)'>建立新的產品</button>
        </div>
        <table class='table'>
            <thead>
                <tr>
                    <td>分類</td>
                    <td>產品名稱</td>
                    <td>原價</td>
                    <td>售價</td> 
                    <td>是否啟用</td>
                    <td>編輯/刪除</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key="item.id">
                    <td>{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td>{{item.origin_price | currency}}</td>
                    <td>{{item.price | currency}}</td>
                    <td>
                        <span v-if='item.is_enabled'>啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td><button class='btn btn-sm btn-info' @click='newOrEditProductModal(false,item)'>編輯</button>
                        <button class='btn btn-sm btn-danger' @click='delProductModal(item)'>刪除</button></td>
                </tr>
            </tbody>
        </table>
        <!-- pagination 
        <nav class=''>
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{disabled:!pagination.has_pre}"><a class="page-link" href="#">Previous</a></li>
                <li class="page-item" v-for='page in pagination.total_pages' :key='page' :class="{active:(page === pagination.current_page)}">
                    <a class="page-link" href="#" @click.prevent='getProducts(page)'>{{page}}</a>
                </li>
                <li class="page-item" :class="{disabled:!pagination.has_next}"><a class="page-link" href="#">Next</a></li>
            </ul>
        </nav> -->
        <!-- Modal -->
        <page ref="product"></page>
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增產品</span>
                    </h5>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                        <label for="image">輸入圖片網址</label>
                        <input type="text" class="form-control" id="image"
                            placeholder="請輸入圖片連結" v-model='tempProduct.imageUrl'>
                        </div>
                        <div class="form-group">
                        <label for="customFile">或 上傳圖片
                            <i class="fas fa-circle-notch fa-spin" v-if='imgLoading'></i>
                        </label>
                        <input type="file" id="customFile" class="form-control"
                            ref="files" @change='fileUpload'>
                        </div>
                        <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                        class="img-fluid" alt="" :src='tempProduct.imageUrl'>
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title"
                            placeholder="請輸入標題" v-model='tempProduct.title'>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">分類</label>
                            <input type="text" class="form-control" id="category"
                            placeholder="請輸入分類" v-model='tempProduct.category'>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">單位</label>
                            <input type="unit" class="form-control" id="unit"
                            placeholder="請輸入單位" v-model='tempProduct.unit'>
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                            <input type="number" class="form-control" id="origin_price"
                            placeholder="請輸入原價" v-model='tempProduct.origin_price'>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">售價</label>
                            <input type="number" class="form-control" id="price"
                            placeholder="請輸入售價" v-model='tempProduct.price'>
                        </div>
                        </div>
                        <hr>

                        <div class="form-group">
                        <label for="description">產品描述</label>
                        <textarea type="text" class="form-control" id="description"
                            placeholder="請輸入產品描述" v-model='tempProduct.description'></textarea>
                        </div>
                        <div class="form-group">
                        <label for="content">說明內容</label>
                        <textarea type="text" class="form-control" id="content"
                            placeholder="請輸入產品說明內容" v-model='tempProduct.content' ></textarea>
                        </div>
                        <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            id="is_enabled" v-model='tempProduct.is_enabled' :true-value='1' :false-value='0'>
                            <label class="form-check-label" for="is_enabled">
                            是否啟用
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click='cancelProductModal'>取消</button>
                    <button type="button" class="btn btn-primary" @click='updateProduct'>確認</button>
                </div>
                </div>
            </div>
        </div>
        <!--刪除-->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click='cancelDelProductModal'>取消</button>
                        <button type="button" class="btn btn-danger" @click='delProduct'
                        >確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
        <div>
        
        </div>
    </div>
</template>


<script>

import $ from 'jquery';
import page from './page';

export default {
    data() {
        return {
            products:[],
            tempProduct:{},
            //判斷商品是新增或是修改
            isNew:'',
            isLoading:false,
            imgLoading:false,
            // pagination:{},
            // changetest:1,
        }
    },
    components:{
        page,
    },
    methods: {
        getProducts(page = 1){
            this.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`).then((response) => {
            this.products = response.data.products;
            this.pagination = response.data.pagination;
            console.log('父親');
            // console.log(this.pagination);
            })  
        },
        newOrEditProductModal(isNew,item){
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            }else{
                this.tempProduct = item;
                this.isNew = false;
            }
            $('#productModal').modal('show');
        },
        updateProduct(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}`;
            vm.isLoading = true;
            if(vm.isNew){
                vm.$http.post(api +'/admin/product',{ data : vm.tempProduct}).then((response) => {
                    vm.isLoading = false;
                });
            }else{
                 vm.$http.put(api + '/admin/product/'+vm.tempProduct.id,{data:vm.tempProduct}).then((response) =>{
                     vm.isLoading = false;
                 });
            }
            vm.getProducts();
            $('#productModal').modal('hide');
        },
        delProductModal(item){
            const vm = this;
            vm.tempProduct = item;
            $('#delProductModal').modal('show');
        },
        delProduct(){
            let vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}`;
            vm.$http.delete(api + '/admin/product/'+vm.tempProduct.id).then((response) => {
                console.log('delete success');
                $('#delProductModal').modal('hide');
                vm.getProducts();
            });
        },
        cancelProductModal(){
            $('#productModal').modal('hide');
        },
        cancelDelProductModal(){
            $('#delProductModal').modal('hide');
        },
        fileUpload(){
            console.log(this);
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}`;
            let formData = new FormData();
            vm.imgLoading = true;
            formData.append('file-to-upload',vm.$refs.files.files[0]);
            vm.$http.post(api+'/admin/upload',formData,{
                header:{
                    'content-Type' : 'multipart/form-data'
                },
            }).then((response)=>{
                console.log(response.data);
                vm.imgLoading=false;
                // vm.tempProduct.imageUrl = response.data.imageUrl;
                //不需靠其他的欄位更新，自己先加入setter,getter去雙向更新
                // 雙向綁定需要透過set或是畫面更新達到雙向綁定
                if(response.data.success){
                    vm.$set(vm.tempProduct,'imageUrl',response.data.imageUrl);
                }else{
                    vm.$bus.$emit('message:push',response.data.message,'danger');
                }
                // vm.changetest++;
                
            });
            console.log(vm);

        }
    },
    created() {
        let vm = this;
        vm.getProducts();
        vm.$bus.$on('page:fire',function(page){
            vm.getProducts(page);
        })
        // this.$bus.$emit('message:push','test', 'danger');
    },
    mounted(){
        this.$refs.product.parentApiName = 'products';
        this.$refs.product.getProduct();
    }
}
</script>