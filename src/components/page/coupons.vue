<template>
    <div>
        <loading :active.sync="isLoading" loader='dots'></loading>
        <div class='text-right my-3'>
            <button class='btn btn-outline-info' @click='showCouponModal(true)'>建立新優惠券</button>
        </div>
        <table class='table'>
            <thead>
                <tr>
                    <td>名稱</td>
                    <td>折扣百分比</td>
                    <td>到期日</td>
                    <td>是否啟用</td>
                    <td>編輯/刪除</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item in coupons' :key='item.id'>
                    <td>{{item.title}}</td>
                    <td>{{item.percent}}</td>
                    <td>{{item.due_date}}</td>
                    <td v-if='item.is_enabled == 1' class='text-success'>啟用</td>
                    <td v-else class='text-danger'>未啟用</td>
                    <td><button class='btn btn-info btn-sm' @click='showCouponModal(false,item)'>編輯</button>
                        <button class='btn btn-danger btn-sm' @click='showDelCouponModal(item)'>刪除</button></td>
                </tr>
            </tbody>
        </table>
        <page ref='myCoupons'></page>
        <!-- modal -->
        <div class="modal fade" id='couponModal' tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">優惠券</h5>
                    <button class='btn btn-outline-light text-dark' @click='cancelCouponModal'><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">標題</label>
                            <input type="text" class="form-control" aria-describedby="emailHelp" v-model='coupon.title'>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">優惠碼</label>
                            <input type="text" class="form-control" v-model='coupon.code'>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">到期日</label>
                            <input type="text" class="form-control" v-model='coupon.due_date'>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">折扣百分比</label>
                            <input type="number" class="form-control" v-model='coupon.percent'>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" v-model='coupon.is_enabled' true-value='1' false-value='0'>
                            <label class="form-check-label" for="exampleCheck1">是否啟用</label>
                        </div>
                        </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click='cancelCouponModal'>Close</button>
                    <button type="button" class="btn btn-info" @click='updateCoupon'>更新優惠券</button>
                </div>
                </div>
            </div>
        </div>
        <!--刪除-->
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
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
                        是否刪除 <strong class="text-danger">{{ coupon.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click='cancelDelCouponModal'>取消</button>
                        <button type="button" class="btn btn-danger" @click='delCoupon'
                        >確認刪除</button>
                    </div>
                </div>
            </div>
        </div> 
    </div>

</template>

<script>
    import $ from 'jquery';
    import page from './page';
    export default {
        data(){
            return{
                coupons:[],
                coupon:{},
                isNew:'',
                tempCoupons:{},
                isLoading:false,
                // currentCouponId:'',
            }
        },
        components:{
            page,
        },
        methods: {
            getCoupon(page = 1){
                this.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`).then((response) => {
                this.coupons = response.data.coupons;
                console.log(response);
                // this.pagination = response.data.pagination;
            // console.log(this.pagination);
                })
            },
            showCouponModal(flag,item){
                let vm = this;
                if(!flag){                  
                    vm.coupon = item;
                    vm.isNew = flag;
                }else{
                    vm.coupon = {};
                    vm.isNew= true;
                }
                
                $('#couponModal').modal('show');
            },
            updateCoupon(){
                let vm = this;
                vm.isLoading = true;
                console.log(vm.coupon);
                if(vm.isNew){
                    this.$http.post(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`,{data : vm.coupon}).then((response)=>{
                        
                    });
                }
                else {
                    this.$http.put(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.coupon.id}`,{data : vm.coupon}).then((response)=>{
                        // console.log(response);
                    });
                }
                vm.isLoading = false;
                vm.getCoupon();
                $('#couponModal').modal('hide');
            },
            showDelCouponModal(item){
                this.coupon = item;
                $('#delCouponModal').modal('show');
                
            },
            delCoupon(){
                let vm = this;
                vm.isLoading = true;
                vm.$http.delete(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.coupon.id}`).then((response) =>{
                    $('#delCouponModal').modal('hide');
                    console.log(response);
                    vm.getCoupon();
                    vm.isLoading = false;
                })
            },
            cancelCouponModal(){
                $('#couponModal').modal('hide');
            },
            cancelDelCouponModal(){
                $('#delCouponModal').modal('hide');
            }
        },
        created(){
            let vm = this;
            this.getCoupon();
            vm.$bus.$on('page:fire',function(page){
            vm.getCoupon(page);
            })
        },
        mounted(){
            this.$refs.myCoupons.parentApiName = 'coupons';
            this.$refs.myCoupons.getProduct();
        }
        
    }
</script>

<style>

</style>