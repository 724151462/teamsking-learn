<template>
    <div>
        <span style="display:inline-block;margin: 10px 0">
            <router-link :to="{name: '互动'}">互动</router-link> > 头脑风暴
        </span>
        <div>
            <el-input type="textarea" v-model="brainStorm.subject" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
            <div class="margin-sides">
                <i class="el-icon-picture"></i>
                <span>添加图片</span>
            </div>
            <div class="margin-sides">
                标题
            </div>
            <el-input placeholder="请添加标题" style="width:600px;"></el-input>
            <div class="margin-sides"><span>所属章节</span></div>
            <div class="margin-sides">
                <el-select v-model="brainStorm.belong.chapter">
                    <el-option value="1">第一章</el-option>
                </el-select>
                <el-select v-model="brainStorm.belong.section">
                    <el-option value="1.1">第一节</el-option>
                </el-select>
            </div>
        </div>
        <el-button >保存</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            brainStorm: {
                subject: '',
                title: '',
                image: [],
                belong: {
                    chapter: '',
                    section: ''
                }
            }
        }
    }
}
</script>

<style>

</style>
