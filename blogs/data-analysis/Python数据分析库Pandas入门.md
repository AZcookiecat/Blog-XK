# Python数据分析库Pandas入门

date: 2025-06-24
author: 井上川
techTags: 数据分析, Python, Pandas
softwareTags: 教程
collection: 数据分析实战指南
summary: 本文详细介绍了Python中最流行的数据分析库Pandas的基本功能和使用方法，包括数据结构（Series和DataFrame）、数据访问与操作、数据清洗与预处理、数据合并与连接、数据分组与聚合、数据重塑与透视表以及数据读写等内容。

## 概述

本文详细介绍了Python中最流行的数据分析库Pandas的基本功能和使用方法，包括数据结构（Series和DataFrame）、数据访问与操作、数据清洗与预处理、数据合并与连接、数据分组与聚合、数据重塑与透视表以及数据读写等内容，帮助读者掌握这一数据分析的核心工具。

## 什么是Pandas？

在上一篇[数据分析入门指南](数据分析入门指南.md)中，我们介绍了数据分析的基本概念和流程。本文将详细介绍Python中最流行的数据分析库——Pandas。

Pandas是一个开源的Python数据分析库，提供了高性能、易用的数据结构和数据分析工具。它是基于NumPy构建的，可以轻松处理结构化数据，是Python数据分析生态系统的核心组件之一。

## Pandas的主要特点

- 提供了灵活的数据结构（Series和DataFrame）
- 支持多种文件格式的读写（CSV、Excel、JSON、SQL等）
- 提供了强大的数据清洗和预处理功能
- 支持数据的索引、切片、聚合和重塑
- 与其他Python库（如NumPy、Matplotlib、Scikit-learn等）良好集成

## 安装Pandas

安装Pandas非常简单，可以使用pip或conda命令：

```bash
# 使用pip安装
pip install pandas

# 使用conda安装
conda install pandas
```

为了完整的数据分析环境，建议同时安装NumPy、Matplotlib和Jupyter Notebook：

```bash
pip install numpy matplotlib jupyter
```

## Pandas的核心数据结构

Pandas提供了两种主要的数据结构：Series和DataFrame。

### 1. Series

Series是一种一维的数组型数据结构，类似于带有标签的NumPy数组。Series可以存储任何数据类型（整数、浮点数、字符串、Python对象等）。

#### 创建Series

```python
import pandas as pd
import numpy as np

# 从列表创建Series
s1 = pd.Series([1, 2, 3, 4, 5])
print(s1)
# 输出:
# 0    1
# 1    2
# 2    3
# 3    4
# 4    5
# dtype: int64

# 指定索引创建Series
s2 = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
print(s2)
# 输出:
# a    1
# b    2
# c    3
# d    4
# e    5
# dtype: int64

# 从字典创建Series
data = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
s3 = pd.Series(data)
print(s3)
# 输出与s2相同

# 从NumPy数组创建Series
arr = np.array([1, 2, 3, 4, 5])
s4 = pd.Series(arr)
print(s4)
# 输出与s1相同
```

#### Series的基本操作

```python
# 访问Series的值
s = pd.Series([1, 2, 3, 4, 5], index=['a', 'b', 'c', 'd', 'e'])
print(s.values)  # 输出: [1 2 3 4 5]
print(s.index)   # 输出: Index(['a', 'b', 'c', 'd', 'e'], dtype='object')

# 通过索引访问元素
print(s['a'])    # 输出: 1
print(s[['a', 'c', 'e']])  # 访问多个元素

# 通过位置访问元素
print(s[0])      # 输出: 1
print(s[:3])     # 切片操作

# 布尔索引
s_bool = s[s > 2]
print(s_bool)
# 输出:
# c    3
# d    4
# e    5
# dtype: int64

# Series的数学运算
print(s + 10)        # 所有元素加10
print(s * 2)         # 所有元素乘2
print(np.sqrt(s))    # 平方根运算

# Series的统计计算
print(s.sum())       # 求和
print(s.mean())      # 平均值
print(s.median())    # 中位数
print(s.max())       # 最大值
print(s.min())       # 最小值
print(s.describe())  # 描述性统计
```

### 2. DataFrame

DataFrame是一种二维的表格型数据结构，可以看作是由Series组成的字典。它既有行索引，又有列索引，适合存储和处理结构化数据。

#### 创建DataFrame

```python
# 从字典创建DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eva'],
    'age': [25, 30, 35, 40, 45],
    'city': ['New York', 'London', 'Paris', 'Tokyo', 'Sydney']
}
df = pd.DataFrame(data)
print(df)
# 输出:
#       name  age      city
# 0    Alice   25  New York
# 1      Bob   30    London
# 2  Charlie   35     Paris
# 3    David   40     Tokyo
# 4      Eva   45    Sydney

# 指定索引创建DataFrame
df = pd.DataFrame(data, index=['a', 'b', 'c', 'd', 'e'])
print(df)

# 从列表的列表创建DataFrame
data = [
    ['Alice', 25, 'New York'],
    ['Bob', 30, 'London'],
    ['Charlie', 35, 'Paris'],
    ['David', 40, 'Tokyo'],
    ['Eva', 45, 'Sydney']
]
columns = ['name', 'age', 'city']
df = pd.DataFrame(data, columns=columns)
print(df)

# 从CSV文件创建DataFrame
# df = pd.read_csv('data.csv')

# 从Excel文件创建DataFrame
# df = pd.read_excel('data.xlsx')
```

#### DataFrame的基本操作

```python
# 查看DataFrame的前几行
print(df.head())  # 默认显示前5行
print(df.head(3))  # 显示前3行

# 查看DataFrame的后几行
print(df.tail())  # 默认显示后5行

# 查看DataFrame的形状
print(df.shape)  # 输出: (5, 3)

# 查看DataFrame的列名
print(df.columns)  # 输出: Index(['name', 'age', 'city'], dtype='object')

# 查看DataFrame的索引
print(df.index)  # 输出: RangeIndex(start=0, stop=5, step=1)

# 查看DataFrame的数据类型
print(df.dtypes)  # 输出各列的数据类型

# 查看DataFrame的基本信息
print(df.info())  # 输出DataFrame的详细信息

# 查看DataFrame的描述性统计
print(df.describe())  # 输出数值列的统计信息
```

## 数据访问与操作

### 1. 列操作

```python
# 选择单列
print(df['name'])
# 或者使用点操作符
print(df.name)

# 选择多列
print(df[['name', 'age']])

# 添加新列
df['gender'] = ['F', 'M', 'M', 'M', 'F']
print(df)

# 基于现有列计算新列
df['age_in_10_years'] = df['age'] + 10
print(df)

# 删除列
df = df.drop('age_in_10_years', axis=1)
# 或者使用inplace参数
df.drop('gender', axis=1, inplace=True)
print(df)
```

### 2. 行操作

```python
# 通过索引选择行
print(df.loc[0])  # 选择第一行
print(df.loc[[0, 2, 4]])  # 选择多行

# 通过位置选择行
print(df.iloc[0])  # 选择第一行
print(df.iloc[0:3])  # 选择前3行

# 布尔索引选择行
young_people = df[df['age'] < 35]
print(young_people)

# 多条件布尔索引
condition1 = df['age'] > 30
condition2 = df['city'] == 'Paris'
selected = df[condition1 & condition2]  # 使用&而不是and
print(selected)

# 添加新行
df.loc[5] = ['Frank', 50, 'Berlin']
print(df)

# 删除行
df = df.drop(5)
print(df)
```

### 3. 数据修改

```python
# 修改单个值
df.loc[0, 'age'] = 26
print(df)

# 修改多个值
df.loc[df['age'] > 40, 'age'] = 42
print(df)

# 使用apply函数应用自定义函数
df['name_length'] = df['name'].apply(len)
print(df)

# 使用map函数映射值
df['city_code'] = df['city'].map({'New York': 'NY', 'London': 'LON', 'Paris': 'PAR', 'Tokyo': 'TYO', 'Sydney': 'SYD'})
print(df)
```

## 数据清洗与预处理

### 1. 处理缺失值

```python
# 创建包含缺失值的DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eva'],
    'age': [25, None, 35, 40, None],
    'city': ['New York', 'London', None, 'Tokyo', 'Sydney']
}
df = pd.DataFrame(data)
print(df)

# 检查缺失值
print(df.isnull())  # 显示每个元素是否为缺失值
print(df.isnull().sum())  # 计算每列的缺失值数量

# 删除包含缺失值的行
df_cleaned = df.dropna()
print(df_cleaned)

# 删除所有值都为缺失值的行
df_cleaned = df.dropna(how='all')
print(df_cleaned)

# 填充缺失值
df_filled = df.fillna({'age': df['age'].mean(), 'city': 'Unknown'})
print(df_filled)

# 使用前一个值填充缺失值
df_filled = df.fillna(method='ffill')
print(df_filled)

# 使用后一个值填充缺失值
df_filled = df.fillna(method='bfill')
print(df_filled)
```

### 2. 数据类型转换

```python
# 查看数据类型
print(df.dtypes)

# 转换数据类型
df['age'] = df['age'].astype('float64')
print(df.dtypes)

# 使用to_numeric函数转换
# df['age'] = pd.to_numeric(df['age'], errors='coerce')  # errors='coerce'将无法转换的值设为NaN

# 使用to_datetime函数转换日期
# df['date'] = pd.to_datetime(df['date'])
```

### 3. 数据去重

```python
# 创建包含重复行的DataFrame
data = {
    'name': ['Alice', 'Bob', 'Alice', 'David', 'Eva'],
    'age': [25, 30, 25, 40, 45],
    'city': ['New York', 'London', 'New York', 'Tokyo', 'Sydney']
}
df = pd.DataFrame(data)
print(df)

# 检查重复行
print(df.duplicated())

# 计算重复行的数量
print(df.duplicated().sum())

# 删除重复行
df_unique = df.drop_duplicates()
print(df_unique)

# 基于特定列删除重复行
df_unique = df.drop_duplicates(subset=['name'])
print(df_unique)
```

### 4. 数据标准化与归一化

```python
# 数据标准化（Z-score标准化）
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df['age_standardized'] = scaler.fit_transform(df[['age']])
print(df)

# 数据归一化（Min-Max归一化）
from sklearn.preprocessing import MinMaxScaler

min_max_scaler = MinMaxScaler()
df['age_normalized'] = min_max_scaler.fit_transform(df[['age']])
print(df)

# 简单的归一化方法
df['age_minmax'] = (df['age'] - df['age'].min()) / (df['age'].max() - df['age'].min())
print(df)
```

## 数据合并与连接

```python
# 创建两个DataFrame
df1 = pd.DataFrame({
    'id': [1, 2, 3, 4],
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'age': [25, 30, 35, 40]
})

df2 = pd.DataFrame({
    'id': [1, 2, 3, 5],
    'city': ['New York', 'London', 'Paris', 'Tokyo'],
    'salary': [50000, 60000, 70000, 80000]
})

# 内连接（只有两个DataFrame中都有的id才会保留）
inner_join = pd.merge(df1, df2, on='id', how='inner')
print(inner_join)

# 左连接（保留df1的所有行，匹配df2的数据）
left_join = pd.merge(df1, df2, on='id', how='left')
print(left_join)

# 右连接（保留df2的所有行，匹配df1的数据）
right_join = pd.merge(df1, df2, on='id', how='right')
print(right_join)

# 外连接（保留两个DataFrame的所有行）
outer_join = pd.merge(df1, df2, on='id', how='outer')
print(outer_join)

# 追加行
combined = df1.append(df2, ignore_index=True)
print(combined)

# 追加列
combined = pd.concat([df1, df2], axis=1)
print(combined)
```

## 数据分组与聚合

```python
# 创建示例DataFrame
data = {
    'department': ['HR', 'HR', 'IT', 'IT', 'IT', 'Finance', 'Finance'],
    'employee': ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace'],
    'salary': [50000, 55000, 60000, 65000, 70000, 75000, 80000],
    'age': [25, 30, 35, 40, 45, 50, 55]
}
df = pd.DataFrame(data)
print(df)

# 按部门分组
grouped = df.groupby('department')

# 查看分组后的结果
for name, group in grouped:
    print(name)
    print(group)
    print()

# 分组后的聚合计算
print(grouped['salary'].mean())  # 计算每个部门的平均工资
print(grouped['salary'].sum())   # 计算每个部门的工资总和
print(grouped['salary'].max())   # 计算每个部门的最高工资
print(grouped['salary'].min())   # 计算每个部门的最低工资

# 多个聚合函数
print(grouped['salary'].agg(['mean', 'sum', 'max', 'min']))

# 对不同列应用不同的聚合函数
print(grouped.agg({
    'salary': ['mean', 'sum'],
    'age': ['mean', 'max']
}))

# 自定义聚合函数
def range_values(x):
    return x.max() - x.min()

print(grouped['salary'].agg(range_values))
```

## 数据重塑与透视表

```python
# 创建示例DataFrame
data = {
    'date': ['2023-01-01', '2023-01-01', '2023-01-02', '2023-01-02', '2023-01-03', '2023-01-03'],
    'product': ['A', 'B', 'A', 'B', 'A', 'B'],
    'sales': [100, 200, 150, 250, 200, 300]
}
df = pd.DataFrame(data)
print(df)

# 创建透视表
pivot_table = df.pivot_table(index='date', columns='product', values='sales', aggfunc='sum')
print(pivot_table)

# 重置索引
pivot_table_reset = pivot_table.reset_index()
print(pivot_table_reset)

# 堆叠和取消堆叠
stacked = pivot_table.stack()
print(stacked)

unstacked = stacked.unstack()
print(unstacked)

# 融化（将宽表转换为长表）
melted = pd.melt(df, id_vars=['date'], value_vars=['sales'], var_name='metric', value_name='value')
print(melted)
```

## 数据读写

```python
# 读取CSV文件
df = pd.read_csv('data.csv')

# 读取Excel文件
df = pd.read_excel('data.xlsx')

# 读取JSON文件
df = pd.read_json('data.json')

# 读取SQL数据
import sqlite3

conn = sqlite3.connect('database.db')
df = pd.read_sql_query('SELECT * FROM table_name', conn)
conn.close()

# 写入CSV文件
df.to_csv('output.csv', index=False)

# 写入Excel文件
df.to_excel('output.xlsx', index=False)

# 写入JSON文件
df.to_json('output.json', orient='records')

# 写入SQL数据库
df.to_sql('table_name', conn, if_exists='replace', index=False)
```

## 总结

本文介绍了Pandas库的基本功能和使用方法，包括数据结构（Series和DataFrame）、数据访问与操作、数据清洗与预处理、数据合并与连接、数据分组与聚合、数据重塑与透视表以及数据读写等内容。

Pandas是Python数据分析中不可或缺的工具，掌握Pandas的使用方法对于进行有效的数据分析至关重要。通过本文的学习，你应该能够使用Pandas进行基本的数据处理和分析工作。

在接下来的文章中，我们将介绍数据可视化、高级数据分析方法和机器学习等内容，帮助你进一步提升数据分析能力。

上一篇：[数据分析入门指南](数据分析入门指南.md)
下一篇：[Python数据可视化入门](python-数据可视化入门.md)