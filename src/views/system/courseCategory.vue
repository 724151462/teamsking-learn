<template>
  <div class="courseCategory" id="courseCategory">

    <div class="tab">
      <div class="tabBar" :class="{ active:showTab1}" @click="switchTab('first')">创建课程分类</div>
      <div class="tabBar" :class="{ active:!showTab1}" @click="switchTab('second')">课程分类列表</div>

      <div class="tabContent" v-show="showTab1">

        <div class="item">
          <span class="red">*</span><span>分类名称</span>
          <el-input style="width: 200px;" v-model="input" placeholder="请输入内容"></el-input>
        </div>

        <div class="item">
          <span>上级分类</span>
          <el-input style="width: 200px;" v-model="input" placeholder="请选择分类"></el-input>
          <div style="color:gray;font-size: 12px;">不选择分类默认为顶级分类</div>
        </div>

        <div class="item">
          <span>排序</span>
          <el-input style="width: 200px;" v-model="input" placeholder=""></el-input>
        </div>

        <div class="item">
          <span class="red">*</span><span>是否显示：</span>
          <template>
            <el-radio v-model="radio" label="1">备选项</el-radio>
            <el-radio v-model="radio" label="2">备选项</el-radio>
          </template>
        </div>

        <div class="item">
          <span class="red"></span><span>关键词：</span>
          <el-input style="width: 200px;" v-model="input" placeholder="请输入内容"></el-input>
        </div>

        <div class="item">
          <span class="red">*</span><span>分类描述：</span>
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="textarea3">
          </el-input>
        </div>

        <el-button type="primary">取消</el-button>
        <el-button type="primary">保存</el-button>


      </div>

      <div class="tabContent" v-show="!showTab1">

        <el-table
            :data="tableData5"
            style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">

              <el-table
                  :data="tableData"
                  :show-header="showHeader" >
                <el-table-column
                    prop="date"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="分类名称">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="级别">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="是否显示">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="课程数量">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="排序">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                </el-table-column>
              </el-table>

            </template>
          </el-table-column>
          <el-table-column
              label="编号"
              prop="id">
          </el-table-column>
          <el-table-column
              label="分类名称"
              prop="id">
          </el-table-column>
          <el-table-column
              label="级别"
              prop="name">
          </el-table-column>
          <el-table-column
              label="课程数量"
              prop="desc">
          </el-table-column>
          <el-table-column
              label="是否显示"
              prop="id">
          </el-table-column>
          <el-table-column
              label="排序"
              prop="id">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
              <el-button type="text" size="small">新增下级</el-button>
            </template>
          </el-table-column>
        </el-table>




      </div>

    </div>




  </div>
</template>

<script>
  export default {
    name: "courseCategory",
    data(){
      return{
        showTab1:false,
        input:'',
        radio: '1',
        textarea3:'',
        showHeader:false,



        tableData5: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }]



      }
    },
    methods:{
      switchTab:function(rank){
        switch(rank){
          case 'first':
            this.showTab1 = true;
            break;
          case 'second':
            this.showTab1 = false;
            break;
        }
        //this.showTab1 = !this.showTab1;
        console.log(this.showTab1)
      }
    }
  }
</script>

<!--<style scoped lang="stylus" type="text/stylus">-->
<style scoped>
  .tab{
    position: relative;
    display: flex;
    justify-content: flex-start;

    /*background: orange;*/
    font-size: 16px;
    line-height: 50px;
  }
  .tab .tabBar{
    width: 200px;
    height: 100%;
    /*background: cyan;*/
    flex-shrink: 0;
    border: 1px solid rgb(230,230,230);
    border-bottom: none;
    text-align: center;
    background: rgb(240,240,240);
  }
  .tab div:first-child{
    border-right: none;
  }
  .tab .active{
    background: white;
    color:#409eff;
  }
  .tab .tabContent{
    position: absolute;
    margin-bottom:20px;
    left:0;
    top: 50px;
    width: 90%;
    min-height: 0;
    /*background: orange;*/
    border: 1px solid rgb(230,230,230);
  }
  .red{
    color:red;
  }



  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  #courseCategory .el-table__expanded-cell {
    padding: 20px 50px;
  }
</style>
