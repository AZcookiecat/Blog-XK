# Python机器学习库Scikit-learn入门

date: 2025-06-24
author: 井上川
techTags: 机器学习, Python, Scikit-learn
softwareTags: 教程
collection: 机器学习实战指南
summary: 本文详细介绍了Python机器学习库Scikit-learn的核心功能与使用方法，包括数据加载与预处理、监督学习算法（分类与回归）、无监督学习算法（聚类与降维）、模型评估与调优以及模型保存与加载等内容，帮助读者快速入门并掌握这一强大的机器学习工具。

## 概述

本文将详细介绍Python中最流行的机器学习库——Scikit-learn的核心功能与使用方法，包括数据加载与预处理、监督学习算法、无监督学习算法、模型评估与调优以及模型保存与加载等内容，帮助读者快速入门并掌握这一强大的机器学习工具。

## 什么是Scikit-learn？

在上一篇[机器学习入门指南](机器学习入门指南.md)中，我们介绍了机器学习的基本概念和分类。本文将详细介绍Python中最流行的机器学习库——Scikit-learn。

Scikit-learn（简称sklearn）是一个开源的Python机器学习库，它提供了简单高效的数据挖掘和数据分析工具，可用于各种监督和无监督学习算法的实现。Scikit-learn建立在NumPy、SciPy和Matplotlib之上，是Python机器学习生态系统的重要组成部分。

## Scikit-learn的主要特点

- **简单易用**：提供了统一的API接口，使用简单直观
- **功能丰富**：支持各种监督和无监督学习算法
- **数据预处理**：提供了数据清洗、特征提取、特征选择等功能
- **模型评估**：提供了丰富的模型评估指标和工具
- **与其他库集成**：与NumPy、SciPy、Matplotlib、Pandas等库良好集成
- **文档完善**：提供了详细的文档和丰富的示例

## 安装Scikit-learn

安装Scikit-learn非常简单，可以使用pip或conda命令：

```bash
# 使用pip安装
pip install scikit-learn

# 使用conda安装
conda install scikit-learn
```

为了完整的机器学习环境，建议同时安装NumPy、SciPy、Matplotlib和Pandas：

```bash
pip install numpy scipy matplotlib pandas jupyter
```

## Scikit-learn的基本数据结构

Scikit-learn使用NumPy数组作为基本数据结构，通常使用以下两种数组：

- **X**：特征矩阵，形状为(n_samples, n_features)，其中n_samples是样本数量，n_features是特征数量
- **y**：目标向量，形状为(n_samples,)，包含每个样本的目标值（标签）

## Scikit-learn的基本流程

使用Scikit-learn进行机器学习通常遵循以下基本流程：

1. 导入必要的库和模块
2. 准备数据（加载数据、数据预处理、特征工程等）
3. 划分训练集和测试集
4. 选择模型并实例化
5. 训练模型
6. 预测新数据
7. 评估模型性能

下面我们将通过具体的例子，详细介绍Scikit-learn的使用方法。

## 数据加载与预处理

### 1. 加载内置数据集

Scikit-learn提供了一些内置的数据集，可以用于学习和测试：

```python
from sklearn import datasets
import pandas as pd

# 加载鸢尾花数据集
iris = datasets.load_iris()
X = iris.data  # 特征矩阵
y = iris.target  # 目标向量
feature_names = iris.feature_names  # 特征名称
 target_names = iris.target_names  # 目标类别名称

# 转换为DataFrame查看数据
iris_df = pd.DataFrame(X, columns=feature_names)
iris_df['target'] = y
print(iris_df.head())

# 加载波士顿房价数据集（回归任务）
boston = datasets.load_boston()
X_boston = boston.data
 y_boston = boston.target

# 加载 digits 数据集（分类任务）
digits = datasets.load_digits()
X_digits = digits.data
y_digits = digits.target
```

### 2. 数据预处理

Scikit-learn提供了丰富的数据预处理工具，用于数据清洗、标准化、归一化等。

#### 数据标准化

数据标准化是将数据转换为均值为0，标准差为1的分布，这对于许多机器学习算法（如SVM、逻辑回归、KNN等）非常重要。

```python
from sklearn.preprocessing import StandardScaler

# 创建标准化器
scaler = StandardScaler()

# 拟合并转换数据
X_scaled = scaler.fit_transform(X)

# 查看标准化后的数据均值和标准差
print('均值:', X_scaled.mean(axis=0))
print('标准差:', X_scaled.std(axis=0))
```

#### 数据归一化

数据归一化是将数据缩放到[0, 1]或[-1, 1]的范围，常用于距离计算相关的算法。

```python
from sklearn.preprocessing import MinMaxScaler

# 创建归一化器
min_max_scaler = MinMaxScaler()

# 拟合并转换数据
X_minmax = min_max_scaler.fit_transform(X)

# 查看归一化后的数据范围
print('最小值:', X_minmax.min(axis=0))
print('最大值:', X_minmax.max(axis=0))
```

#### 处理缺失值

Scikit-learn提供了处理缺失值的工具，可以用均值、中位数、众数等填充缺失值。

```python
from sklearn.impute import SimpleImputer
import numpy as np

# 创建含有缺失值的数据
X_with_nan = np.copy(X)
X_with_nan[0, 0] = np.nan  # 设置第一个元素为缺失值

# 创建缺失值填充器
imputer = SimpleImputer(missing_values=np.nan, strategy='mean')

# 拟合并转换数据
X_imputed = imputer.fit_transform(X_with_nan)

# 查看填充后的数据
print('填充前:', X_with_nan[0, 0])
print('填充后:', X_imputed[0, 0])
```

#### 类别特征编码

机器学习算法通常不能直接处理类别特征，需要将其转换为数值。Scikit-learn提供了多种类别特征编码方法。

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import pandas as pd

# 创建含有类别特征的数据
cat_data = pd.DataFrame({
    'color': ['red', 'green', 'blue', 'red', 'green'],
    'size': ['S', 'M', 'L', 'M', 'L']
})

# 标签编码（Label Encoding）
label_encoder = LabelEncoder()
cat_data['color_encoded'] = label_encoder.fit_transform(cat_data['color'])
print(cat_data)

# 独热编码（One-Hot Encoding）
from sklearn.compose import ColumnTransformer

ct = ColumnTransformer(
    transformers=[
        ('onehot', OneHotEncoder(), ['color', 'size'])
    ],
    remainder='passthrough'
)

X_encoded = ct.fit_transform(cat_data.drop('color_encoded', axis=1))
print(X_encoded.toarray())
```

### 3. 特征选择

特征选择是从原始特征中选择最相关的特征子集，以提高模型性能和减少计算复杂度。

```python
from sklearn.feature_selection import SelectKBest, f_classif

# 选择K个最佳特征
selector = SelectKBest(score_func=f_classif, k=2)
X_selected = selector.fit_transform(X, y)

# 查看选择的特征索引
selected_indices = selector.get_support(indices=True)
print('选择的特征索引:', selected_indices)
print('选择的特征名称:', [feature_names[i] for i in selected_indices])
```

### 4. 划分训练集和测试集

为了评估模型的泛化能力，通常需要将数据划分为训练集和测试集。

```python
from sklearn.model_selection import train_test_split

# 划分训练集和测试集，测试集占30%
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# 查看数据集大小
print('训练集大小:', X_train.shape)
print('测试集大小:', X_test.shape)
```

## 监督学习算法

Scikit-learn提供了丰富的监督学习算法，下面介绍几个常用的分类和回归算法。

### 1. 分类算法

#### 逻辑回归（Logistic Regression）

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 创建逻辑回归模型
log_reg = LogisticRegression(random_state=42, max_iter=1000)

# 训练模型
log_reg.fit(X_train, y_train)

# 预测测试集
y_pred = log_reg.predict(X_test)

# 评估模型性能
accuracy = accuracy_score(y_test, y_pred)
print(f'准确率: {accuracy:.4f}')

# 详细的分类报告
print('分类报告:')
print(classification_report(y_test, y_pred, target_names=target_names))

# 混淆矩阵
print('混淆矩阵:')
print(confusion_matrix(y_test, y_pred))
```

#### 决策树（Decision Tree）

```python
from sklearn.tree import DecisionTreeClassifier

# 创建决策树模型
dt = DecisionTreeClassifier(random_state=42, max_depth=3)

# 训练模型
dt.fit(X_train, y_train)

# 预测测试集
y_pred = dt.predict(X_test)

# 评估模型性能
accuracy = accuracy_score(y_test, y_pred)
print(f'准确率: {accuracy:.4f}')

# 查看特征重要性
feature_importance = dt.feature_importances_
for i, importance in enumerate(feature_importance):
    print(f'{feature_names[i]}: {importance:.4f}')
```

#### 随机森林（Random Forest）

```python
from sklearn.ensemble import RandomForestClassifier

# 创建随机森林模型
rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=3)

# 训练模型
rf.fit(X_train, y_train)

# 预测测试集
y_pred = rf.predict(X_test)

# 评估模型性能
accuracy = accuracy_score(y_test, y_pred)
print(f'准确率: {accuracy:.4f}')

# 查看特征重要性
feature_importance = rf.feature_importances_
for i, importance in enumerate(feature_importance):
    print(f'{feature_names[i]}: {importance:.4f}')
```

#### 支持向量机（Support Vector Machine，SVM）

```python
from sklearn.svm import SVC

# 创建SVM模型（使用RBF核）
svm = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)

# 训练模型
svm.fit(X_train, y_train)

# 预测测试集
y_pred = svm.predict(X_test)

# 评估模型性能
accuracy = accuracy_score(y_test, y_pred)
print(f'准确率: {accuracy:.4f}')
```

### 2. 回归算法

我们使用波士顿房价数据集来演示回归算法。

```python
from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split

# 加载波士顿房价数据集
boston = load_boston()
X_boston = boston.data
y_boston = boston.target
feature_names_boston = boston.feature_names

# 划分训练集和测试集
X_train_boston, X_test_boston, y_train_boston, y_test_boston = train_test_split(
    X_boston, y_boston, test_size=0.3, random_state=42
)
```

#### 线性回归（Linear Regression）

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 创建线性回归模型
lr = LinearRegression()

# 训练模型
lr.fit(X_train_boston, y_train_boston)

# 预测测试集
y_pred_boston = lr.predict(X_test_boston)

# 评估模型性能
mse = mean_squared_error(y_test_boston, y_pred_boston)
r2 = r2_score(y_test_boston, y_pred_boston)
print(f'均方误差 (MSE): {mse:.4f}')
print(f'R² 评分: {r2:.4f}')

# 查看系数
coef = pd.DataFrame({
    'Feature': feature_names_boston,
    'Coefficient': lr.coef_
})
print(coef)
```

#### 决策树回归（Decision Tree Regression）

```python
from sklearn.tree import DecisionTreeRegressor

# 创建决策树回归模型
dt_reg = DecisionTreeRegressor(random_state=42, max_depth=3)

# 训练模型
dt_reg.fit(X_train_boston, y_train_boston)

# 预测测试集
y_pred_boston = dt_reg.predict(X_test_boston)

# 评估模型性能
mse = mean_squared_error(y_test_boston, y_pred_boston)
r2 = r2_score(y_test_boston, y_pred_boston)
print(f'均方误差 (MSE): {mse:.4f}')
print(f'R² 评分: {r2:.4f}')

# 查看特征重要性
feature_importance = dt_reg.feature_importances_
for i, importance in enumerate(feature_importance):
    print(f'{feature_names_boston[i]}: {importance:.4f}')
```

#### 随机森林回归（Random Forest Regression）

```python
from sklearn.ensemble import RandomForestRegressor

# 创建随机森林回归模型
rf_reg = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=3)

# 训练模型
rf_reg.fit(X_train_boston, y_train_boston)

# 预测测试集
y_pred_boston = rf_reg.predict(X_test_boston)

# 评估模型性能
mse = mean_squared_error(y_test_boston, y_pred_boston)
r2 = r2_score(y_test_boston, y_pred_boston)
print(f'均方误差 (MSE): {mse:.4f}')
print(f'R² 评分: {r2:.4f}')

# 查看特征重要性
feature_importance = rf_reg.feature_importances_
for i, importance in enumerate(feature_importance):
    print(f'{feature_names_boston[i]}: {importance:.4f}')
```

## 无监督学习算法

Scikit-learn也提供了丰富的无监督学习算法，下面介绍几个常用的聚类和降维算法。

### 1. 聚类算法

#### K均值聚类（K-means Clustering）

```python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# 创建K均值聚类模型
kmeans = KMeans(n_clusters=3, random_state=42)

# 训练模型并预测聚类
cluster_labels = kmeans.fit_predict(X)

# 可视化聚类结果（使用前两个特征）
plt.figure(figsize=(10, 6))
plt.scatter(X[:, 0], X[:, 1], c=cluster_labels, cmap='viridis', s=50, alpha=0.7)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=200, c='red', marker='X')
plt.xlabel(feature_names[0])
plt.ylabel(feature_names[1])
plt.title('K-means Clustering Results')
plt.show()
```

#### 层次聚类（Hierarchical Clustering）

```python
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, linkage

# 使用scipy进行层次聚类并绘制树状图
linked = linkage(X, method='ward')

plt.figure(figsize=(12, 8))
dendrogram(linked, orientation='top', distance_sort='descending', show_leaf_counts=True)
plt.title('Hierarchical Clustering Dendrogram')
plt.xlabel('Sample Index')
plt.ylabel('Distance')
plt.show()

# 创建层次聚类模型
agg_clustering = AgglomerativeClustering(n_clusters=3, affinity='euclidean', linkage='ward')

# 预测聚类
cluster_labels = agg_clustering.fit_predict(X)

# 可视化聚类结果
plt.figure(figsize=(10, 6))
plt.scatter(X[:, 0], X[:, 1], c=cluster_labels, cmap='viridis', s=50, alpha=0.7)
plt.xlabel(feature_names[0])
plt.ylabel(feature_names[1])
plt.title('Agglomerative Clustering Results')
plt.show()
```

### 2. 降维算法

#### 主成分分析（Principal Component Analysis，PCA）

```python
from sklearn.decomposition import PCA

# 创建PCA模型，降维到2维
pca = PCA(n_components=2)

# 拟合并转换数据
X_pca = pca.fit_transform(X)

# 查看解释方差比
print(f'解释方差比: {pca.explained_variance_ratio_}')
print(f'累计解释方差比: {sum(pca.explained_variance_ratio_):.4f}')

# 可视化降维结果
plt.figure(figsize=(10, 6))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', s=50, alpha=0.7)
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('PCA of Iris Dataset')
plt.colorbar(label='Target')
plt.show()
```

#### t-SNE降维

```python
from sklearn.manifold import TSNE

# 创建t-SNE模型，降维到2维
tsne = TSNE(n_components=2, random_state=42, perplexity=30)

# 转换数据
X_tsne = tsne.fit_transform(X)

# 可视化降维结果
plt.figure(figsize=(10, 6))
plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='viridis', s=50, alpha=0.7)
plt.xlabel('t-SNE Component 1')
plt.ylabel('t-SNE Component 2')
plt.title('t-SNE of Iris Dataset')
plt.colorbar(label='Target')
plt.show()
```

## 模型评估与调优

### 1. 交叉验证

交叉验证是一种评估模型泛化能力的方法，它将数据划分为多个子集，然后多次训练和测试模型。

```python
from sklearn.model_selection import cross_val_score

# 使用5折交叉验证评估模型
scores = cross_val_score(log_reg, X, y, cv=5, scoring='accuracy')
print(f'交叉验证准确率: {scores}')
print(f'平均准确率: {scores.mean():.4f}')
```

### 2. 超参数调优

超参数调优是提高模型性能的重要步骤，Scikit-learn提供了多种超参数调优方法。

#### 网格搜索（Grid Search）

```python
from sklearn.model_selection import GridSearchCV

# 定义参数网格
param_grid = {
    'C': [0.1, 1.0, 10.0],
    'kernel': ['linear', 'rbf'],
    'gamma': ['scale', 'auto', 0.1, 1.0]
}

# 创建网格搜索对象
grid_search = GridSearchCV(SVC(random_state=42), param_grid, cv=5, scoring='accuracy', n_jobs=-1)

# 执行网格搜索
grid_search.fit(X_train, y_train)

# 查看最佳参数和最佳得分
print(f'最佳参数: {grid_search.best_params_}')
print(f'最佳交叉验证得分: {grid_search.best_score_:.4f}')

# 使用最佳模型预测
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
print(f'测试集准确率: {accuracy_score(y_test, y_pred):.4f}')
```

#### 随机搜索（Random Search）

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform, randint

# 定义参数分布
param_dist = {
    'C': uniform(0.1, 10.0),
    'kernel': ['linear', 'rbf'],
    'gamma': ['scale', 'auto'] + list(uniform(0.1, 1.0).rvs(10))
}

# 创建随机搜索对象
random_search = RandomizedSearchCV(
    SVC(random_state=42), 
    param_distributions=param_dist, 
    n_iter=20, 
    cv=5, 
    scoring='accuracy', 
    n_jobs=-1,
    random_state=42
)

# 执行随机搜索
random_search.fit(X_train, y_train)

# 查看最佳参数和最佳得分
print(f'最佳参数: {random_search.best_params_}')
print(f'最佳交叉验证得分: {random_search.best_score_:.4f}')

# 使用最佳模型预测
best_model = random_search.best_estimator_
y_pred = best_model.predict(X_test)
print(f'测试集准确率: {accuracy_score(y_test, y_pred):.4f}')
```

### 3. 模型评估指标

Scikit-learn提供了丰富的模型评估指标，下面介绍几个常用的指标。

#### 分类评估指标

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import confusion_matrix, classification_report, roc_auc_score

# 准确率
accuracy = accuracy_score(y_test, y_pred)
print(f'准确率: {accuracy:.4f}')

# 精确率（宏观平均和加权平均）
precision_macro = precision_score(y_test, y_pred, average='macro')
precision_weighted = precision_score(y_test, y_pred, average='weighted')
print(f'精确率（宏观平均）: {precision_macro:.4f}')
print(f'精确率（加权平均）: {precision_weighted:.4f}')

# 召回率（宏观平均和加权平均）
recall_macro = recall_score(y_test, y_pred, average='macro')
recall_weighted = recall_score(y_test, y_pred, average='weighted')
print(f'召回率（宏观平均）: {recall_macro:.4f}')
print(f'召回率（加权平均）: {recall_weighted:.4f}')

# F1分数（宏观平均和加权平均）
f1_macro = f1_score(y_test, y_pred, average='macro')
f1_weighted = f1_score(y_test, y_pred, average='weighted')
print(f'F1分数（宏观平均）: {f1_macro:.4f}')
print(f'F1分数（加权平均）: {f1_weighted:.4f}')

# 分类报告
print('分类报告:')
print(classification_report(y_test, y_pred, target_names=target_names))

# 混淆矩阵
print('混淆矩阵:')
cm = confusion_matrix(y_test, y_pred)
print(cm)

# 可视化混淆矩阵
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=target_names, yticklabels=target_names)
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.show()
```

#### 回归评估指标

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

# 均方误差（MSE）
mse = mean_squared_error(y_test_boston, y_pred_boston)
print(f'均方误差 (MSE): {mse:.4f}')

# 均方根误差（RMSE）
rmse = np.sqrt(mse)
print(f'均方根误差 (RMSE): {rmse:.4f}')

# 平均绝对误差（MAE）
mae = mean_absolute_error(y_test_boston, y_pred_boston)
print(f'平均绝对误差 (MAE): {mae:.4f}')

# R² 评分
r2 = r2_score(y_test_boston, y_pred_boston)
print(f'R² 评分: {r2:.4f}')

# 可视化预测值与真实值
plt.figure(figsize=(10, 6))
plt.scatter(y_test_boston, y_pred_boston, alpha=0.7)
plt.plot([min(y_test_boston), max(y_test_boston)], [min(y_test_boston), max(y_test_boston)], 'r--')
plt.xlabel('True Values')
plt.ylabel('Predicted Values')
plt.title('True vs Predicted Values')
plt.show()
```

## 模型保存与加载

训练好的模型可以保存到文件，以便后续使用或部署。

```python
import joblib

# 保存模型到文件
joblib.dump(rf, 'random_forest_model.pkl')

# 从文件加载模型
loaded_model = joblib.load('random_forest_model.pkl')

# 使用加载的模型进行预测
y_pred_loaded = loaded_model.predict(X_test)

# 验证加载的模型性能
avg_accuracy = accuracy_score(y_test, y_pred_loaded)
print(f'加载模型的准确率: {avg_accuracy:.4f}')
```

## 总结

本文介绍了Scikit-learn库的基本功能和使用方法，包括数据加载与预处理、监督学习算法（分类和回归）、无监督学习算法（聚类和降维）、模型评估与调优以及模型保存与加载等内容。

Scikit-learn是Python机器学习领域最流行的库之一，它提供了简单高效的数据挖掘和数据分析工具，适用于各种监督和无监督学习任务。通过本文的学习，你应该能够使用Scikit-learn进行基本的机器学习任务，包括数据预处理、模型训练、评估和调优等。

在接下来的文章中，我们将介绍更高级的机器学习主题，包括特征工程、集成学习、深度学习等内容，帮助你进一步提升机器学习能力。

上一篇：[机器学习入门指南](机器学习入门指南.md)
下一篇：[特征工程与数据预处理](特征工程与数据预处理.md)