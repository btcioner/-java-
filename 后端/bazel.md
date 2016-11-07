## bazel编译tensorflow时抛出EOF异常
### 解决方案：
```
    This is most likely to occur with "Out of memory". So I compiled it with "bazel build -c opt --jobs 20 ...",and everything is OK .
```
