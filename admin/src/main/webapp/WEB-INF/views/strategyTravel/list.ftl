<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>大家都在看平台</title>
    <#include "../common/header.ftl" >
    <script type="text/javascript" src="/js/My97DatePicker/WdatePicker.js"></script>
    <script>
        $(function () {

        })

    </script>
</head>
<body>
<div class="container " style="margin-top: 20px">
    <#include "../common/top.ftl">
    <div class="row">
        <div class="col-sm-3">
            <#assign currentMenu="strategyTravel"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">大攻略管理</h1>
                </div>
                <!--高级查询--->
               <#-- <form class="form-inline" id="searchForm" action="/strategy/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1">
                    <div class="form-group">
                        <label>关键字</label>
                        <input class="form-control" type="text" name="keyword" value="${(qo.keyword)!}">
                    </div>
                    <div class="form-group">
                        <button id="query" type="submit" class="btn btn-success"><i class="icon-search"></i> 查询</button>
                    </div>
                    <a href="javascript:void(0);" class="btn btn-success btn-input">添加</a>
                </form>-->
            </div>
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>编号</th>
                    <th>攻略标题</th>
                    <th>副标题</th>
                    <th>图片</th>
                </tr>

                </thead>

                <#list strategies as entity>
                    <tr>
                        <td>${entity_index + 1}</td>
                        <td>${entity.title}</td>
                        <td>${entity.subTitle}</td>
                        <td><img src="${entity.coverUrl}" width="50px"/></td>

                    </tr>
                </#list>
            </table>
        </div>
    </div>
</div>
</body>
</html>