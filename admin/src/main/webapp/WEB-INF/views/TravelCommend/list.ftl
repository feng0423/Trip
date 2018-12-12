<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>骡窝窝系统管理平台</title>
    <#include "../common/header.ftl" >
    <script type="text/javascript" src="/js/My97DatePicker/WdatePicker.js"></script>
    <script>
        $(function () {
            $(".travelCommend").click(function () {
                var json = $(this).data("json");
                console.log(json.coverUrl);
                //回显模态框数据
                $("input[name='id']").val(json.id); //回显游记id的隐藏域
                $("input[name=title]").val(json.title); //回显标题
                $("input[name=subTitle]").val(json.subTitle); //回显标题
                $("input[name='coverUrl']").val(json.coverUrl); //提交表单
                $("#coverUrl").attr('src', json.coverUrl); //给人看的
                console.log(json.coverUrl);
                $("input[name=schedule]").val(json.schedule); //回显标题
                $("select[name=type]").val(json.type); //回显标题
                $("#skip").attr("href","/travel/releaseList.do?travelId="+json.travelId); //a变迁的查看文章
                $("#travelModal").modal("show");
            })
            //提交表单
            $("#btn-submit").click(function () {
                //将表单的提交方式改为ajax异步提交
                $("#editForm").ajaxSubmit(function (data) {
                    if (data.success) {
                        $.messager.alert("温馨提示", "操作成功,2s后关闭");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }
                })
            });
        })

    </script>
</head>
<body>
<div class="container " style="margin-top: 20px">
    <#include "../common/top.ftl">
    <div class="row">
        <div class="col-sm-3">
            <#assign currentMenu="travelCommend"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">游记推荐管理</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/travelCommend/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1">
                    <div class="form-group">
                        <select id="qo_type" class="form-control" autocomplete="off" name="type">
                            <option value="-1">全部</option>
                            <option value="2">每月推荐</option>
                            <option value="1">每周推荐</option>
                            <option value="3">攻略推荐</option>
                        </select>
                        <script>
                            $("#qo_type").val(${(qo.type)!})
                        </script>
                        <button id="query" type="submit" class="btn btn-success"><i class="icon-search"></i> 查询</button>
                    </div>
                </form>
            </div>
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>封面</th>
                    <th>标题</th>
                    <th>副标题</th>
                    <th>推荐时间安排</th>
                    <th>推荐类型</th>
                </tr>

                </thead>

                <#list pageInfo.list as entity>
                    <tr>
                        <td>${entity_index+1}</td>
                        <td><img src="${entity.coverUrl}" style="width: 30px; height: 30px"></td>
                        <td>${(entity.title)!}</td>
                        <td>${(entity.subTitle)!}</td>
                        <td>${(entity.schedule?string('yyyy-MM-dd'))!}</td>
                        <td>${(entity.typeName)!}</td>
                        <td>
                            <a href="javascript:void(-1);" class="travelCommend" data-json='${(entity.json)!}'>修改</a>
                        </td>
                    </tr>
                </#list>
            </table>
          <#include "../common/page.ftl">
        </div>
    </div>
</div>
<div id="travelModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">新增游记标记</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal" method="post" action="/travelCommend/saveOrUpdate.do"
                      enctype="multipart/form-data">
                    <input type="hidden" name="id"/>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">标题</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">副标题</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="subTitle" placeholder="副标题">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">封面</label>
                        <div class="col-sm-6">
                            <img id="coverUrl" width="100%">
                            <input type="file" class="form-control" name="file">
                        <#--注意这里还需要增减一个隐藏域-->
                            <input type="hidden" class="form-control" name="coverUrl">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">推荐时间</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="schedule" onclick="WdatePicker()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">推荐类型</label>
                        <div class="col-sm-6">
                            <select class="form-control" autocomplete="off" name="type">
                                <option value="1">每月推荐</option>
                                <option value="2">每周推荐</option>
                                <option value="3">攻略推荐</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="text-align: center">
                        <a href="javascript:void(0)" target="_blank" id="skip">点击查看游记文章明细</a>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <a href="javascript:void(0);" class="btn btn-success" id="btn-submit" aria-hidden="true">保存</a>
                <a href="javascript:void(0);" class="btn" data-dismiss="modal" aria-hidden="true">关闭</a>
            </div>
        </div>
    </div>
</div>
</body>
</html>