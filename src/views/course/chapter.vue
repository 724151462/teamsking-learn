<template>
    <div class="course-tab-container">
        <div style="background:gray">
            <span class="shuxian">|</span><span>教学模式</span>
            <div class="radio">
                <el-radio @change="changeTModel" v-model="patternId" 
                    v-for="(option, index) in pattern" :key="index" 
                    :label="option.label">
                    {{option.modelName}}
                </el-radio>
            </div>
        </div>
        <div class="main-container">
            <el-collapse>
                <el-collapse-item v-for="(chapter, chapterIndex) in sourceData" :key="chapterIndex">
                    <template slot="title">
                    <div class="chapter-index">
                        <div class="chapter-index chapter-inner">{{chapterIndex+1}}</div>
                    </div>
                    <div class="title-container">
                        <span>{{chapter.chapterName}}</span>
                        <div slot="right-side" class="operate">
                            <span @click.stop="addJieBtn(chapter)">+添加节</span>
                            <span>删除</span>
                            <!-- <span class="spread" @click="spread(chapter)">{{fold}}</span> -->
                        </div>
                    </div>
                    </template>
                    <el-collapse-item style="margin-left: 30px" v-for="(jie, jieIndex) in chapter.catalogSection" :key="jieIndex">
                        <template slot="title">
                        <div  class="title-container" style="margin-left: 40px; background-color: rgb(243,247,255)">
                            <span>{{jie.sectionName}}</span>
                            <div class="operate">
                                <span @click.stop="addContentBtn(jie)">+添加内容</span>
                                <span>删除</span>
                                <!-- <span  class="spread" @click="spread(chapter)">展开</span> -->
                            </div>
                        </div>
                        
                        </template>
                        <div style="margin: 0 auto; width:90%;" v-for="(content, contentIndex) in jie.catalogItem" :key="contentIndex">
                            <div style="padding: 5px 10px;">
                                <div class="itemTitleContainer">
                                    <div style="display: flex;align-items: center;margin-right: 10px">
                                        <img :src="typeIcon(content)" width="40" alt="" style="margin-right: 10px">
                                        <span>{{content.itemName}}</span>
                                        <div class="vedio-info" v-if="content.resourceType === 10 || content.resourceType === 30">
                                            <span style="margin-left: 15px">时长：{{content.resourceLength | timeTransfer}}</span>
                                            <el-tooltip class="item" effect="dark" :content="strUrl(content)" placement="top-start">
                                                <img :src="require('../../assets/images/cc.png')" style="margin-left: 5px" height="18px"/>
                                            </el-tooltip>
                                           <el-tooltip class="item" effect="dark" :content="transProgress(content)" placement="top-start">
                                                <img :src="require('../../assets/images/tcode.png')" style="margin-left: 5px" height="18px"/>
                                            </el-tooltip>
                                        </div>
                                        </div>
                                    <div class="operate">
                                        <span @click="addSubjectBtn(content)">+题目</span>
                                        <span>编辑</span>
                                        <span>删除</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </el-collapse-item>
                </el-collapse-item>
            </el-collapse>
            <div class="addChapter" @click="addChapterBtn">添加章</div>
            <adialog :dialogConfig="dialogConfig"
                :dataObj="dataObj"
                :formData="formData"
                @showComponentInfo="showComponentInfo"
                :show.sync="show"></adialog>
        </div>
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

        <!-- 添加内容对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="60%">
            <el-tabs v-model="activeName2" :stretch="true" type="card" @tab-click="handleClick">
                <el-tab-pane label="视频" name="first">
                    <el-form v-model="videoForm">
                        <el-form-item label="视频标题" required>
                            <el-input v-model="videoForm.itemName" style="width: 220px;"></el-input>
                        </el-form-item>
                        <el-form-item label="视频" required>
                            <el-input v-model="videoForm.video" style="width: 220px;display: none"></el-input>
                            <el-button @click="showVedioDialog">+添加视频</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="文档" name="second">
                    <el-form v-model="docForm">
                        <el-form-item label="文档标题" required>
                            <el-input v-model="docForm.itemName" style="width: 220px;"></el-input>
                        </el-form-item>
                        <el-form-item label="视频" required>
                            <el-input v-model="docForm.document" style="width: 220px;display: none"></el-input>
                            <el-button @click="showVedioDialog">+添加文档</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addItem">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加资源对话框 -->
        <el-dialog :visible.sync="vedioDialog" :title="addTitle">
            <div class="searchContainer">
                <span>从资源库导入</span>
                <el-input style="width: 300px" type="text" placeholder="输入视频名称查找" suffix-icon="el-icon-search"></el-input>
            </div>
            <div class="courseSelect">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-collapse>
                    <el-collapse-item v-for="(chapter, chapterIndex) in uploadSource" :key="chapterIndex">
                        <template slot="title">
                        <span>{{chapter.chapterName}}</span>
                        <div class="operate">
                            <!-- <i class="el-icon-circle-check"></i><span @click="selectAll(chapter)">全选</span> -->
                            <span>{{chapter.createTime}}</span>
                        </div>
                        </template>
                        <div class="radioContainer" v-for="(jie, jieIndex) in chapter.catalogSection" :key="jieIndex">
                            <el-radio v-model="radio" :label="jie.jid">
                                {{jie.sectionName}}
                            </el-radio>
                            <span>{{jie.resourceLength|timeTransfer}}</span>
                        </div>
                        
                    </el-collapse-item>
                </el-collapse>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="vedioDialog = false">取 消</el-button>
                <el-button type="primary" @click="vedioDialog = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加题目对话框 -->
        <el-dialog
        title="添加题目"
        top="30vh"
        :visible.sync="subjectVisible"
        width="65%">
        <div class="subject-container">
            <div class="subject-left">
                <!-- <video :src="vedioUrl"></video> -->
                <videoPlayer
                    :isMp4="vedioUrl"
                    :poster="coverUrl"
                >

                </videoPlayer>
            </div>
            <div class="subject-right">
                <div class="row-container">
                    <span>视频内测验时间点（共{{subjectList.length}}处）</span>
                    <span class="test-btn" @click="addTime">+ 新增时间点</span>
                </div>
                <div class="row-container margin" v-for="(subject, index) in subjectList" :key="index">
                    <div>
                        <span>第{{index + 1}}处:</span>
                        <input v-model="subject.time" type="text" style="border: 1px solid black; width: 120px; margin-left:5px" placeholder="输入00:00:00格式" @blur="saveAddTime(index)">
                    </div>
                    <div class="subject-operate">
                        <span>预览</span>
                        <span @click="editSubject(index)">编辑</span>
                        <span @click="delSubject(index)">删除</span>
                    </div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveAllSubj">确 定</el-button>
        </span>
        </el-dialog>


        <!-- 编辑题目对话框 -->
        <el-dialog
        title="编辑题目"
        top="40vh"
        :visible.sync="editSubjectVisible"
        width="35%">
        <div>
            <div><span style="color:rgb(85, 200, 255)">资源库导入</span></div>
            <div style="float: right">
                <el-input type="text" placeholder="请输入测试题名称" suffix-icon="el-icon-search" style="width: 300px"></el-input>
                <el-button>查询</el-button>
            </div>
            <div class="subjRadio">
                <el-radio v-for="item in sourceSubList" :key="item.id" :label="item.title" v-model="subjPick"></el-radio>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editSubjectVisible = false">取 消</el-button>
            <el-button type="primary" @click="editEnsure">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import adialog from '@/components/dialog'
import videoPlayer from '@/components/video-pay'
import {
    chaptersList,
    chaptersAdd,
    sectionAdd,
    itemAdd,
    studyModeModify,
    courseBaseInfo
} from '@/api/course'
export default {
    data() {
      return {
        // courseId: '0608367675f54267aa6960fd0557cc1b',
        courseId: this.$route.query.id,
        studyMode: {
            courseId: this.$route.query.id,
            studyMode: ''
        },
        chapterFold: false,
        jieFold: false,
        pattern: [{label: '10', modelName: "开放学习"}, {label: '20', modelName: "顺序学习"}],
        patternId: '10',
        // 对话框
        show: false,
        dialogConfig: {
            btnShow: true,
            title: '',
            width: '40',
            labelWidth: '120',
            top: '40',
            inputWidth: '70',
            eventType: ''
        }, 
        dataObj: {
        },
        dialogVisible: false,
        activeName2: 'first',
        // 课程选择
        value: '',
        options: [],
        checkedList: [],
        checkAll: false,
        formData:[],
        tempChapter: '',
        sourceData: [
            {
                chapterName: '第一章',
                cid: '1',
                fold: '',
                createTime: '2018-11-22',
                catalogSection: [
                    {
                        sectionName: '第一节',
                        jid: '1.1',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '1.1'
                            },
                            {
                                itemName: '1.2'
                            }
                        ]
                    },
                    {
                        sectionName: '第二节',
                        jid: '1.2',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '2.1'
                            },
                            {
                                itemName: '2.2'
                            }
                        ]
                    }
                ]
            },
            {
                chapterName: '第二章',
                fold: false,
                cid: '2',
                createTime: '2018-11-22',
                catalogSection: [
                    {
                        sectionName: '第一节',
                        jid: '2.1',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '1.1'
                            },
                            {
                                itemName: '1.2'
                            }
                        ]
                    },
                    {
                        sectionName: '第二节',
                        jid: '2.2',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '2.1'
                            },
                            {
                                itemName: '2.2'
                            }
                        ]
                    }
                ]
            }
        ],
        uploadSource: [
            {
                chapterName: '第一章',
                cid: '1',
                fold: '',
                createTime: '2018-11-22',
                catalogSection: [
                    {
                        sectionName: '资料1',
                        resourceLength: 4200,
                        jid: '1.1',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '1.1'
                            },
                            {
                                itemName: '1.2'
                            }
                        ]
                    },
                    {
                        sectionName: '资料2',
                        resourceLength: 3400,
                        jid: '1.2',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '2.1'
                            },
                            {
                                itemName: '2.2'
                            }
                        ]
                    }
                ]
            },
            {
                chapterName: '第二章',
                fold: false,
                cid: '2',
                createTime: '2018-11-22',
                catalogSection: [
                    {
                        sectionName: '资料1',
                        resourceLength: 300,
                        jid: '2.1',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '1.1',
                                resourceLength: 300
                            },
                            {
                                itemName: '1.2',
                                resourceLength: 300
                            }
                        ]
                    },
                    {
                        sectionName: '资料2',
                        resourceLength: 300,
                        jid: '2.2',
                        fold: false,
                        catalogItem: [
                            {
                                itemName: '2.1',
                                resourceLength: 300
                            },
                            {
                                itemName: '2.2',
                                resourceLength: 300
                            }
                        ]
                    }
                ]
            }
        ],

        
        addTitle: '',
        // 添加视频
        videoForm: {
            itemName: '',
            itemType: 10,
            video: '',
            contentType: 10,
            courseId: this.$route.query.id
        },
        radio: '1.2',
        // 添加内容类型tab
        contentType: '视频',
        // 添加文档
        // 添加视频
        docForm: {
            itemName: '',
            itemType: 10,
            document: '',
            contentType: 20,
            courseId: this.$route.query.id
        },
        vedioDialog: false,
        // 添加题目对话框
        subjectVisible: false,
        subjectList: [{
            time: '',
            title: ''
        }],
        // 题目弹窗的视频地址
        vedioUrl: '',
        // 题目弹窗的视频封面
        coverUrl: '',
        // 添加题目的时间
        addTimeInput: '',
        editSubjectVisible: false,
        // 资源库导入题目
        sourceSubList:[
            {title:'静态题1', id: 'subj1'},
            {title:'静态题2', id: 'subj2'}
        ],
        // 添加题目缓存的下标
        sourceSubListIndex: '',
        // 选项model
        subjPick: ''
      }
    },
    mounted() {
        chaptersList(this.courseId)
        .then((response)=> {
            this.sourceData = response.data
        })
        courseBaseInfo(this.courseId)
        .then(response=> {
            console.log(response.data)
        })
    },
    methods: {
        // 修改教学模式
        changeTModel(value) {
            this.studyMode.studyMode = value
            // console.log(this.studyMode)
            studyModeModify(this.studyMode)
            .then(response=> {
                console.log(response.data)
            })
        },
        chapterClick(value) {
            
            // console.log(value)
            //   this.chapterFold = 
        },
        addChapterBtn() {
            this.dialogConfig.eventType = 'addChapter'
            this.dialogConfig.title = '添加章'
            this.formData = []
            this.formData.push({
                key: '章名称：',
                inputType: 'string',
                value: 'chapterName'
            })
            this.show = true
        },
        spread(item) {
            console.log('spread',item)
        },
        showComponentInfo(type, data) {
            console.log('事件:',type,'表单数据:', data)
            switch (type) {
                case 'addChapter':
                    console.log(data.chapterName)
                    this.addChapter(data.chapterName)
                    break;
            
                case 'addJie':
                    this.addJie(data.jieName)
                    break;
            }

        },
        addChapter(chapterName) {
            chaptersAdd({chapterStatus: 2, courseId: this.courseId, chapterName: chapterName})
            .then((response)=> {
                console.log(response.data)
            })
        },
        addJieBtn(info) {
            console.log('jie', info)
            this.tempChapter = info.chapterId
            this.formData = []
            this.formData.push({
                key: '节名称：',
                inputType: 'string',
                value: 'jieName',
            })
            this.dialogConfig.eventType = 'addJie'
            this.dialogConfig.title = '添加节'
            this.show = true
        },
        // 添加内容弹窗
        addContentBtn(data) {
            console.log(data)
            this.videoForm.chapterId = data.chapterId
            this.videoForm.sectionId = data.sectionId
            this.docForm.chapterId = data.chapterId
            this.docForm.sectionId = data.sectionId
            this.dialogVisible = true
        },
        // 添加内容对话框确认按钮
        addItem() {
            console.log(this.contentType)
            let formType = ''
            if(this.contentType === '视频') {
                formType = this.videoForm
            }else{
                formType = this.docForm
            }
            console.log('ft', formType)
            itemAdd(formType)
            .then((response)=> {
                console.log(response.data)
            })
        },
        addJie(jieName) {
            console.log('jiename', jieName)
            console.log('zhangID', this.tempChapter)
            sectionAdd({chapterId: this.tempChapter, courseId: this.courseId, sectionName: jieName})
            .then((response)=> {
                console.log(response.data)
            })
            // this.sourceData.push({chapter: chapterName})
        },
        handleClick(tab, event) {
            console.log(tab.label);
            this.contentType = tab.label
        },
        // 资源类型图标
        typeIcon(info) {
            if (info.contentType === 10) {
                return require('../../assets/images/vedio.png')
            }else{
                return require('../../assets/images/word.png')
            }
            
        },
        // 字幕信息
        strUrl(info) {
            if(info.strUrl) {
                return '有字幕'
            }else{
                return '无字幕'
            }
        },
        // 转码信息过滤
        transProgress(info) {
            switch (info) {
                case 10:
                    return '正在转码'
                    break;
                case 20:
                    return '已转码'
                    break;
                case 30:
                    return '转码失败'
                    break;
                default:
                    return '暂无信息'
                    break;
            }
        },
        addSubjectBtn(subject) {
            console.log('题目所在的内容', subject)
            this.vedioUrl = subject.resourceUrl
            this.coverUrl = subject.coverUrl
            this.subjectList = []
            this.subjectVisible = true
        },
        // 点击添加视频弹出视频列表弹窗
        showVedioDialog() {
            this.vedioDialog = true
        },
        // 添加时间点
        addTime() {
            if(this.subjectList.length >= 3) {
                alert('亲，3题差不多了哦')
                return
            }else{
                this.subjectList.push({time: ''})
            }
        },
        // 保存时间点
        saveAddTime(index) {
            // this.subjectList[index].time = this.addTimeInput
        },
        // 删除时间点
        delSubject(index) {
            this.subjectList.splice(index, 1)
            console.log(this.subjectList)
        },
        // 编辑题目弹窗
        editSubject(index) {
            console.log('当前点击的添加时间点', index)
            this.sourceSubListIndex = index
            this.editSubjectVisible = true
        },
        // 选完题确认按钮
        editEnsure() {
            console.log(this.sourceSubListIndex)
            this.subjectList[this.sourceSubListIndex].title = this.subjPick
            console.log('题目列表对象', this.subjectList)
        },
        // 保存所有的题目信息
        saveAllSubj() {
            console.log(this.subjectList)
            this.subjectVisible = false
        }
    },
    filters: {
        timeTransfer(s) {
            var t;
            if(s > -1){
                var hour = Math.floor(s/3600);
                var min = Math.floor(s/60) % 60;
                var sec = s % 60;
                if(hour < 10) {
                    t = '0'+ hour + ":";
                } else {
                    t = hour + ":";
                }

                if(min < 10){t += "0";}
                t += min + ":";
                if(sec < 10){t += "0";}
                t += sec;
            }
            return t;
        },
    },
    components:{
        adialog,
        videoPlayer
    }
}
</script>

<style lang="stylus" type="text/stylus" scoped>
.course-tab-container
    div
        .shuxian
            color: gold
            font-weight: bold
            font-size: 30px
        .radio
            display inline
            margin-left 50px
    .main-container
        margin-top 20px
    .chapter-index
        display inline-block
        width 26px
        height 26px
        line-height 26px
        text-align center
        color white
        background-color rgb(113, 183,249)
        border 1px solod white
        border-radius 50%
        margin-right 20px
        .chapter-inner
            width: 20px; height: 20px;line-height: 20px;margin-left: 3px; background-color: rgb(58, 148,239)
    .title-container
        display: inline-block; width: 90%; heitght: 40px; line-height: 40px; border: 1px solid rgb(230,230,230);padding: 0 10px;border-radius:5px
    .itemTitleContainer
        display: flex;align-items: center;justify-content: space-between; padding: 5px 10px; border: 1px solid rgb(230,230,230);border-radius: 20px
        .vedio-info
            display flex
            align-item center
            img
                cursor pointer
    .chapter-content
        display flex
        align-items center
        justify-content space-between
        padding 0 50px
    .operate
        display inline-block
        float right 
        cursor pointer
        .spread 
            z-index: 10 
            position: relative
            padding-right:8px
        span 
            margin-left 20px
    .addChapter
        height 50px
        line-height 50px
        border 2px dashed rgb(148,171,190)
        border-radius 15px
        text-align center
        cursor pointer
.searchContainer
    display flex
    align-items center
    justify-content space-between
    padding 10px 20px
    padding-top 0
    border-bottom 1px solid #e4e7ed
.courseSelect
    padding 10px 20px
    border-bottom 1px solid #e4e7ed
.radioContainer
    display flex
    justify-content space-between
    width 400px
    margin 0 auto
    .el-radio+.el-radio
        margin-left: 0px
.subject-container
    height 400px
    display flex
    justify-content space-between
    .subject-left
        background pink
        width 720px
    .subject-right
        display flex
        align-items center
        flex-direction: column;
        width 420px
        .row-container
            display flex
            justify-content space-between
            margin 0 auto
            width 94%
            .test-btn
                background-color rgb(82,204,102)
                padding 5px 10px
                color #fff
                cursor pointer
        .margin
            padding-top 20px
            .subject-operate
                span
                    margin-left 10px
                    color rgb(76, 197, 255)
                    cursor pointer
.subjRadio
    clear both
    display flex
    flex-direction column
    .el-radio+.el-radio 
        margin 10px 0
</style>

