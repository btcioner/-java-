## 为了批量执行脚本，同时替换文本中特定值
### 场景描述，部署产品时会有脚本留下，而且文本内容相同．目前希望通过历史脚本来升级
```
  #!/usr/bin/env bash
for entry in "$search_dir"/home/xiejinbin/code/mercury/web/setup/*.sh
do
  echo "$entry"
  echo $entry
  sed -i 's/version="0.[^\"]/version=\"0.8/' $entry
  sshpass -p "mima"
  sh $entry
done
```
