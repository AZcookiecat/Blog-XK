# Hadoop环境搭建与配置详解

date: 2025-06-24
author: 井上川
techTags: 大数据, Hadoop, Linux, Java
softwareTags: 教程
collection: Ubuntu/Linux实战指南
summary: 本文详细介绍了搭建Hadoop环境的完整步骤，包括环境准备、Hadoop安装配置以及三种部署模式（单机模式、伪分布式模式和完全分布式模式）的实现方法，帮助读者快速搭建大数据开发环境。

## 概述

在上一篇[大数据入门指南](大数据入门指南.md)中，我们了解了大数据的基本概念和技术栈。本文将详细介绍如何搭建Hadoop环境，这是学习大数据技术的重要第一步。

Hadoop是一个开源的分布式计算框架，主要由HDFS（分布式文件系统）和MapReduce（分布式计算框架）组成。在本文中，我们将介绍三种常见的Hadoop部署模式：单机模式、伪分布式模式和完全分布式模式。

## 环境准备

在安装Hadoop之前，我们需要准备好以下环境：

### 1. 操作系统要求
- 推荐使用Linux系统（Ubuntu、CentOS等）
- Windows系统也可以安装，但需要额外配置
- 本文以Ubuntu 22.04为例进行讲解

### 2. Java环境
Hadoop是基于Java开发的，因此需要安装Java环境：

```bash
# 更新软件包列表
sudo apt update

# 安装OpenJDK 8
sudo apt install openjdk-8-jdk

# 验证Java安装
java -version
```

### 3. 配置SSH免密登录
Hadoop节点之间需要通过SSH通信，配置免密登录可以方便节点间通信：

```bash
# 生成SSH密钥对
ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa

# 将公钥添加到authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# 设置权限
chmod 600 ~/.ssh/authorized_keys

# 测试SSH免密登录
ssh localhost
```

## 安装Hadoop

### 1. 下载Hadoop

```bash
# 下载Hadoop安装包（以Hadoop 3.3.6为例）
wget https://downloads.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz

# 解压安装包
tar -xzf hadoop-3.3.6.tar.gz

# 移动到/usr/local目录
sudo mv hadoop-3.3.6 /usr/local/hadoop

# 设置权限
sudo chown -R $USER:$USER /usr/local/hadoop
```

### 2. 配置环境变量

编辑`~/.bashrc`文件，添加以下内容：

```bash
# Hadoop环境变量
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

使环境变量生效：

```bash
source ~/.bashrc
```

## 配置Hadoop

### 1. 单机模式（默认模式）

单机模式是Hadoop的默认模式，不需要任何配置，主要用于开发和测试。

```bash
# 运行Hadoop自带的示例程序
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar pi 2 5
```

### 2. 伪分布式模式

伪分布式模式是在一台机器上模拟分布式环境，适合学习和开发测试。

#### 配置core-site.xml

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/usr/local/hadoop/tmp</value>
    </property>
</configuration>
```

#### 配置hdfs-site.xml

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>/usr/local/hadoop/dfs/name</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>/usr/local/hadoop/dfs/data</value>
    </property>
    <property>
        <name>dfs.http.address</name>
        <value>0.0.0.0:50070</value>
    </property>
</configuration>
```

#### 配置mapred-site.xml

```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

#### 配置yarn-site.xml

```xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>localhost</value>
    </property>
</configuration>
```

#### 启动Hadoop

```bash
# 格式化HDFS
hdfs namenode -format

# 启动HDFS
sbin/start-dfs.sh

# 启动YARN
sbin/start-yarn.sh

# 检查进程
jps
```

成功启动后，可以通过浏览器访问以下地址：
- HDFS Web界面：http://localhost:50070
- YARN Web界面：http://localhost:8088

### 3. 完全分布式模式

完全分布式模式是真正的生产环境部署模式，需要多台服务器。由于篇幅限制，这里只简单介绍配置思路：

1. 在多台机器上安装相同版本的Java和Hadoop
2. 配置主机名和IP映射
3. 配置SSH免密登录
4. 配置Hadoop配置文件，设置主节点和从节点
5. 分发配置文件到所有节点
6. 格式化HDFS并启动集群

## Hadoop基本操作

### 文件操作

```bash
# 创建目录
hdfs dfs -mkdir /input

# 上传文件
hdfs dfs -put /path/to/local/file /input

# 列出目录内容
hdfs dfs -ls /input

# 查看文件内容
hdfs dfs -cat /input/file.txt

# 下载文件
hdfs dfs -get /input/file.txt /path/to/local
```

### 运行MapReduce作业

```bash
# 运行WordCount示例
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /input /output

# 查看结果
hdfs dfs -cat /output/part-r-00000
```

## 常见问题与解决方案

### 1. Java路径错误
- 检查`JAVA_HOME`环境变量是否正确设置
- 确保Hadoop配置文件中指定了正确的Java路径

### 2. SSH连接问题
- 检查防火墙设置
- 确保`authorized_keys`文件权限正确
- 验证SSH服务是否正常运行

### 3. 端口占用问题
- 使用`netstat -tuln`检查端口占用情况
- 可以修改Hadoop配置文件中的端口号

### 4. 权限问题
- 确保Hadoop相关目录的权限正确
- 检查运行Hadoop的用户是否有足够权限

## 总结

本文详细介绍了Hadoop环境的搭建和配置过程，包括单机模式、伪分布式模式和完全分布式模式的配置方法。通过本文的学习，你应该能够成功搭建一个Hadoop环境，并进行基本的Hadoop操作。

在下一篇文章中，我们将介绍HDFS分布式文件系统的原理和操作，敬请期待！

上一篇：[大数据入门指南](大数据入门指南.md)
下一篇：[HDFS分布式文件系统详解](hdfs-分布式文件系统详解.md)