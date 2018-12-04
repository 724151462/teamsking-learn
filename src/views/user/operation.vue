<template>
  <div>
    <div class="title">
      <h3>操作记录</h3>
       <input id="upload" type="file" @change="importXsl(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
      <!--<input type="file" @click="importXsl(this)" ref="inputer" />导入-->
      <el-button type="text" @click="output">导出数据</el-button>
    </div>
    <div style="padding:100px 10% 0 10%">
      <el-table
        id="mytable"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="操作时间">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="登录IP">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作记录">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import { export_json_to_excel } from '@/vendor/Export2Excel.js'　　//引入文件　　　　　　
  export default {
    name: "operation",
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          ip: '王小虎',
          operation: '修改了登录密码'
        },{
          date: '2016-05-03',
          ip: '王小虎',
          operation: '修改了登录密码'
        },{
          date: '2016-05-03',
          ip: '王小虎',
          operation: '修改了登录密码'
        },{
          date: '2016-05-03',
          ip: '王小虎',
          operation: '修改了登录密码'
        },{
          date: '2016-05-03',
          ip: '王小虎',
          operation: '修改了登录密码'
        },{
          date: '2016-05-03',
          ip: '王小虎',
          operation: '修改了登录密码'
        },]
      }
    },
    methods:{
      //下载
      output() {
        require.ensure([], () => {
          //const { export_json_to_excel } = require('@/vendor/Export2Excel.js');　　//引入文件　　　　　　
          const tHeader = [ '操作时间', 'IP','操作记录' ]; //表头
          const filterVal = ['date', 'ip','operation'];//table表格中对应的属性名　　　　　
          const data = this.formatJson(filterVal, this.tableData);　//表格绑定数据positionData转json　　　　　　　
          export_json_to_excel(tHeader, data, '操作记录');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //上传
      importXsl(obj) {

        let _this = this;

        let inputDOM = this.$refs.inputer;  // 通过DOM取文件数据

        this.file = event.currentTarget.files[0];

        var rABS = false; //是否将文件读取为二进制字符串

        var f = this.file;

        var reader = new FileReader();

        //if (!FileReader.prototype.readAsBinaryString) {

        FileReader.prototype.readAsBinaryString = function (f) {

          var binary = "";

          var rABS = false; //是否将文件读取为二进制字符串

          var pt = this;

          var wb; //读取完成的数据

          var outdata;

          var reader = new FileReader();

          reader.onload = function (e) {

            var bytes = new Uint8Array(reader.result);

            var length = bytes.byteLength;

            for (var i = 0; i < length; i++) {

              binary += String.fromCharCode(bytes[i]);

            }

            var XLSX = require('xlsx');

            if (rABS) {

              wb = XLSX.read(btoa(fixdata(binary)), { //手动转化

                type: 'base64'

              });

            } else {

              wb = XLSX.read(binary, {

                type: 'binary'

              });

            }

            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西

            let arr = []

            outdata.map(v => {
              let obj = {}

              obj.date = v.操作时间
              obj.ip = v.IP
              obj.operation = v.操作记录

              arr.push(obj)
            })

            // 更新数据
            _this.tableData = arr
            // 新数据写入数据库

            _this.$message({

              message: '请耐心等待导入成功',

              type: 'success'

            });



          }

          reader.readAsArrayBuffer(f);

        }

        if (rABS) {

          reader.readAsArrayBuffer(f);

        } else {

          reader.readAsBinaryString(f);

        }
      }
    },

  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .title
    border-bottom 2px solid rgb(215, 215, 215);
</style>