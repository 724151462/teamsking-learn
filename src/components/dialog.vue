<template>
    <el-dialog
    :title="dialogConfig.title"
    :visible.sync="visible"
    :dataObj="dataObj"
    :top="dialogTop"
    :width="dialogConfig.width+'%'"
    @close="$emit('update:show', false)"
    >
        <el-form ref="form" :model="form" :label-width="labelWidth">
            <el-form-item v-for="(item, index) in formData" :key="index" :label="item.key">
                <el-input v-if="item.inputType==='string'" v-model="dataObj[item.value]"></el-input>
                <el-radio-group v-else-if="item.inputType==='radio'" v-model="dataObj[item.value]">
                    <el-radio v-for="(val, i) in item.option" :key="i" :label="val"></el-radio>
                </el-radio-group>
                <el-select v-else-if="item.inputType==='select'" :label="item.key" v-model="dataObj[item.value]">
                    <el-option v-for="(val, i) in item.option" :key="i" :label="val.label" :value="val.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="dialogConfig.btnShow===true">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit(dataObj)">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            visible: this.show,
            labelWidth: this.dialogConfig.labelWidth + 'px',
            dialogTop: this.dialogConfig.top + 'vh',
            form: {
            }
        };
    },
    props: ['show', 'formData', 'dialogConfig', 'dataObj'],
    created(){
        console.log(this.dialogConfig.btnShow)

    },
    methods: {
        onSubmit(info) {
            this.visible = false
            console.log( '子组件类型：' , this.dialogConfig.eventType , '\n子组件信息:' , info );
            this.$emit('showComponentInfo',this.dialogConfig.eventType,info);
        }
    },
    watch: {
        show () {
            this.visible = this.show;
        }
    }
}
</script>

<style>
</style>