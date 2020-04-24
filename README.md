# cocosCreator
类说明：

Base:对cocosCreator的API作进一步的封装以方便使用。暂时有点乱。

EventModel:基于观察者模式设计的事件分发模型。

SingleTouchComponent:单点触控组件。

DynimicResHolder:动态资源管理类。

NodeEventLocker:互斥节点之间的点击事件等的节点锁。

scrollView文件夹：对srcollView组件的优化。

    SingleTypeBaseScrollView：单一item类型的scrollView优化。

page文件夹：页面路由系统。

    page:基本页面类，之后可进行拓展，如侧滑页面等。

    PageRouter:页面路由，模拟android的activity的栈管理机制，API模拟浏览器的history对象。

    PageInstanceManager:负责具体加载，创建，销毁，和持有页面引用的类。

    PageScene：一个简单的页面路由持有者的类，页面路由持有者可以同时拥有多个页面路由。



