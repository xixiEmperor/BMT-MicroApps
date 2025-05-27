# 场地管理接口文档

## 基础信息
- **模块名称**: 场地管理
- **基础路径**: `/api/venue`
- **版本**: v1.0

## 接口列表

### 1. 获取所有场地列表

**接口地址**: `GET /api/venue/list`

**接口描述**: 获取系统中所有场地的列表信息

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "1号场地",
      "description": "标准羽毛球场地",
      "status": 1,
      "price": 50.0,
      "createTime": "2024-01-01 10:00:00",
      "updateTime": "2024-01-01 10:00:00"
    }
  ]
}
```

---

### 2. 获取场地状态矩阵

**接口地址**: `GET /api/venue/status-matrix`

**接口描述**: 获取指定日期和场地的状态矩阵，用于可视化展示场地使用情况

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| date | String | 是 | 查询日期，格式：yyyy-MM-dd |
| venueId | Integer | 否 | 场地ID，不传则查询所有场地 |

**请求示例**:
```
GET /api/venue/status-matrix?date=2024-01-01&venueId=1
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "date": "2024-01-01",
    "venueId": 1,
    "venueName": "1号场地",
    "timeSlots": [
      {
        "time": "08:00-09:00",
        "status": 0,
        "bookingId": null
      },
      {
        "time": "09:00-10:00",
        "status": 1,
        "bookingId": 123
      }
    ]
  }
}
```

---

### 3. 查询场地可用性

**接口地址**: `GET /api/venue/availability`

**接口描述**: 按时间段查询场地可用性，用于查找指定时间段内的可用场地

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| date | String | 是 | 查询日期，格式：yyyy-MM-dd |
| startTime | String | 是 | 开始时间，格式：HH:mm |
| endTime | String | 是 | 结束时间，格式：HH:mm |

**请求示例**:
```
GET /api/venue/availability?date=2024-01-01&startTime=09:00&endTime=11:00
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "date": "2024-01-01",
    "startTime": "09:00",
    "endTime": "11:00",
    "availableVenues": [
      {
        "id": 1,
        "name": "1号场地",
        "price": 50.0,
        "isAvailable": true
      },
      {
        "id": 2,
        "name": "2号场地",
        "price": 60.0,
        "isAvailable": false
      }
    ]
  }
}
```

---

### 4. 根据状态获取场地列表

**接口地址**: `GET /api/venue/list/status/{status}`

**接口描述**: 根据场地状态筛选场地列表

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | Integer | 是 | 场地状态（0-停用，1-启用，2-维护中） |

**请求示例**:
```
GET /api/venue/list/status/1
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "1号场地",
      "description": "标准羽毛球场地",
      "status": 1,
      "price": 50.0,
      "createTime": "2024-01-01 10:00:00",
      "updateTime": "2024-01-01 10:00:00"
    }
  ]
}
```

---

### 5. 根据ID获取场地详情

**接口地址**: `GET /api/venue/{id}`

**接口描述**: 根据场地ID获取场地的详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Integer | 是 | 场地ID |

**请求示例**:
```
GET /api/venue/1
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "1号场地",
    "description": "标准羽毛球场地",
    "status": 1,
    "price": 50.0,
    "createTime": "2024-01-01 10:00:00",
    "updateTime": "2024-01-01 10:00:00"
  }
}
```

---

### 6. 新增场地 🔒

**接口地址**: `POST /api/venue/add`

**接口描述**: 新增场地信息（需要管理员权限）

**权限要求**: `ROLE_ADMIN`

**请求参数**:
```json
{
  "name": "场地名称",
  "description": "场地描述",
  "price": 50.0,
  "status": 1
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 是 | 场地名称 |
| description | String | 否 | 场地描述 |
| price | Double | 是 | 场地价格 |
| status | Integer | 是 | 场地状态（0-停用，1-启用，2-维护中） |

**响应示例**:
```json
{
  "code": 200,
  "message": "场地新增成功",
  "data": "success"
}
```

---

### 7. 更新场地信息 🔒

**接口地址**: `PUT /api/venue/update/{id}`

**接口描述**: 更新场地信息（需要管理员权限）

**权限要求**: `ROLE_ADMIN`

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Integer | 是 | 场地ID |

**请求参数**:
```json
{
  "name": "更新后的场地名称",
  "description": "更新后的场地描述",
  "price": 60.0,
  "status": 1
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "场地信息更新成功",
  "data": "success"
}
```

---

### 8. 更新场地状态 🔒

**接口地址**: `PUT /api/venue/status/{id}`

**接口描述**: 更新场地状态（需要管理员权限）

**权限要求**: `ROLE_ADMIN`

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Integer | 是 | 场地ID |

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | Integer | 是 | 场地状态（0-停用，1-启用，2-维护中） |

**请求示例**:
```
PUT /api/venue/status/1?status=2
```

**响应示例**:
```json
{
  "code": 200,
  "message": "场地状态更新成功",
  "data": "success"
}
```

---

### 9. 删除场地 🔒

**接口地址**: `DELETE /api/venue/delete/{id}`

**接口描述**: 删除场地（需要管理员权限）

**权限要求**: `ROLE_ADMIN`

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Integer | 是 | 场地ID |

**请求示例**:
```
DELETE /api/venue/delete/1
```

**响应示例**:
```json
{
  "code": 200,
  "message": "场地删除成功",
  "data": "success"
}
```

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有管理员权限的接口都需要在请求头中携带有效的JWT Token
2. 请求参数中标记为必填的字段不能为空
3. 场地状态的具体含义需要根据业务需求确定（如：0-禁用，1-启用）
4. 所有接口都返回统一的ResponseVo格式
5. 日期时间格式统一为：`yyyy-MM-dd HH:mm:ss` 