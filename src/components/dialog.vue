<template>
    <div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="visible"
            @close="$emit('update:show', false)"
            :show="show">
            <el-form ref="form" :model="studentFormModel" label-width="80px">
                <el-form-item v-for="(item, index) in studentFormData" :key="index">
                    {{item}}
                    <el-form-item v-if="item.inputType=='str'" :label="item.name">
                        <el-input v-model="item.value"></el-input>
                    </el-form-item>
                    <el-form-item v-else-if="item.inputType=='radio'" :label="item.name">
                        <el-radio-group v-model="item.value">
                            <!-- <div v-for="(val, i) in item.choice" :label="val" :key="i">{{option}}</div> -->
                            <el-radio v-for="(val, i) in item.choice" :label="val" :key="i"></el-radio>
                            <el-option :label="item.choice[0]"></el-option>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
                <!-- <el-form-item label="学号">
                    <el-input v-model="studentFormData.studentNo"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="studentFormData.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="studentFormData.mobile"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="studentFormData.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="院名称">
                    <el-select v-model="collegeId" placeholder="院名称">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="-2" label="无院"></el-option>
                        <el-option 
                            v-for="item in listData.collegeList" 
                            :key="item.collegeId" 
                            :label="item.collegeName"
                            :value="item.collegeId"></el-option>
                        </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="系名称">
                    <el-select v-model="departmentId" placeholder="系名称">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="-2" label="无系"></el-option>
                        <el-option 
                            v-for="item in listData.departmentList" 
                            :key="item.departmentId" 
                            :label="item.departmentName"
                            :value="item.departmentId"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="专业">
                    <el-select v-model="specialityId" placeholder="专业">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option 
                            v-for="item in listData.specialityList" 
                            :key="item.specialityId" 
                            :label="item.specialityName"
                            :value="item.specialityId"></el-option>
                        </el-select>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级"> -->
                    <!-- <el-select v-model="classId" placeholder="班级">
                        <el-option value="-1" label="请添加班级"></el-option>
                        <el-option 
                            v-for="item in listData.classList" 
                            :key="item.classId" 
                            :label="item.className"
                            :value="item.classId"></el-option>
                        </el-select> -->
                </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
 
<script>
    export default {
        data () {
            return {
                visible: this.show,
                collegeId: {
                type: String,
                    default: ''
                },
                departmentId: {
                    type: String,
                    default: ''
                },
                specialityId: {
                    type: String,
                    default: ''
                },
                classId: {
                    type: String,
                    default: ''
                }
            };
        },
        // props: {
        //     show: {
        //         type: Boolean,
        //         default: false
        //     },
        //     studentFormData,
        //     listData
        //     // collegeId: {
        //     //     type: String,
        //     //     default: ''
        //     // },
        //     // departmentId: {
        //     //     type: String,
        //     //     default: ''
        //     // },
        //     // specialityId: {
        //     //     type: String,
        //     //     default: ''
        //     // },
        //     // classId: {
        //     //     type: String,
        //     //     default: ''
        //     // }
        // },
        created(){
            console.log(this.studentFormData[2])
        },
        props: {show:Boolean, listData:Object, studentFormData:Array,dialogTitle:String,formType:String, studentFormModel: Object},
        methods: {
            submit(){
                // console.log(this.formType)
                this.$emit('formEvent',this.formType,this.studentFormData)
            }
        },
        watch: {
            show () {
                this.visible = this.show;
            },
            collegeId: function(val){
                console.log(val)
                if(val == -1 || val == -2){
                    this.departmentList = this.departmentRows
                }else{
                    this.departmentList = this.departmentRows.filter(function (x) { return x.collegeId == val });
                }
                this.departmentId = this.departmentList.length>0 ? this.departmentList[0].departmentId : "";
            },
            // departmentId: function(val){
            //     if(val == -1 || val == -2){
            //         this.specialityList = this.specialityRows
            //     }else{
            //         this.specialityList = this.specialityRows.filter(function (x) { return x.departmentId == val });
            //     }
            //     this.specialityId = this.specialityList.length>0 ? this.specialityList[0].specialityName : "";
            // },
            // specialityId: function(val){
            //     if(val == -1){
            //         this.classList = this.classRows
            //     }else{
            //         this.classList = this.classRows.filter(function (x) { return x.specialityId == val });
            //     }
            //     this.classId = this.classList.length>0 ? this.classList[0].classId : "";
            // }
        }
    };
</script>