// 判断是否叶子节点
const isLeaf = (data, prop) => {
    return !(Array.isArray(data[prop]) && data[prop].length > 0)
  }
  
  // 创建 node 节点
  export const renderNode = (h, data, context) => {
    const { props } = context
    const cls = []
    const childNodes = []
    const children = data[props.props.children]
  
    if (isLeaf(data, props.props.children)) {
      cls.push('is-leaf')
    } else if (props.collapsable && !data[props.props.expand]) {
      cls.push('collapsed')
    }
    cls.push('org-tree-node')
  
    if(data[props.props.couple]){
       childNodes.push(renderNodeCouple(h, data, context))
    } else { 
        childNodes.push(renderLabel(h, data, context))
    }

    
    if (!props.collapsable || data[props.props.expand]) {
      childNodes.push(renderChildren(h, children, context))
    }
  

    return h('div', {
      domProps: {
        className: cls.join(' ')
      }
    }, childNodes)
  
  }

  export const renderNodeCouple = (h, data, context) => {
    const { props } = context
    const cls = ['org-tree-node-label']
    const coupleNodes = []
    
    let node1 = renderCoupleLabel(h, data, context)
    let node2 = renderCoupleLabel(h, data[props.props.spouse], context)
    coupleNodes.push(node1,node2)
  

    if (props.collapsable && !isLeaf(data, props.props.children)) {
      coupleNodes.push(renderBtn(h, data, context))
    }

    return h('div', {
      domProps: {
        className: cls.join(' ')
      }
    }, coupleNodes)
  
  }  
  
  // 创建展开折叠按钮
  export const renderBtn = (h, data, { props, listeners }) => {
    const expandHandler = listeners['on-expand']
  
    let cls = ['org-tree-node-btn']
    // let cls = []

    // if(data[props.props.couple]){
    //   cls.push('fm-tree-node-btn')      
    // }else{
    //   cls.push('org-tree-node-btn')        
    // }    
  
    if (data[props.props.expand]) {
      cls.push('expanded')
    }
  
    return h('span', {
      domProps: {
        className: cls.join(' ')
      },
      on: {
        click: e => expandHandler && expandHandler(e,data)
      }
    })
  }
  
  // Label for couple
  export const renderCoupleLabel = (h, data, context) => {
    const { props, listeners } = context
    const label = data[props.props.label]
    const renderContent = props.renderContent  
    let spouse = {}
    let className = 'org-tree-node-label-couple'
 
     
    // event handlers
    const clickHandler = listeners['on-node-click']
    const mouseOverHandler = listeners['on-node-mouseover']
    const mouseOutHandler = listeners['on-node-mouseout']
  
    const childNodes = []
    if (typeof renderContent === 'function') {
 
      let vnode = renderContent(h, data)     
      vnode && childNodes.push(vnode)

    } else {
      childNodes.push(label)
    }  
 
  
    const cls = ['org-tree-node-label-inner']
    let { labelWidth, labelClassName, selectedClassName, selectedKey } = props
  
    if (typeof labelWidth === 'number') {
      labelWidth += 'px'
    }
  
    if (typeof labelClassName === 'function') {
      labelClassName = labelClassName(data)
    }
  
    labelClassName && cls.push(labelClassName)
  
    // add selected class and key from props
    if (typeof selectedClassName === 'function') {
      selectedClassName = selectedClassName(data)
    }
  
    selectedClassName && selectedKey && data[selectedKey] && cls.push(selectedClassName)
  
    return h('div', {
      domProps: {
        className: className
      }
    }, [h('div', {
      domProps: {
        className: cls.join(' ')
      },
      style: { width: labelWidth },
      on: {
        'click': e => clickHandler && clickHandler(e, data),
        'mouseover': e => mouseOverHandler && mouseOverHandler(e, data),
        'mouseout': e => mouseOutHandler && mouseOutHandler(e, data)
      }
    }, childNodes)])
  }
  


  // 创建 label 节点
  export const renderLabel = (h, data, context) => {
    const { props, listeners } = context
    const label = data[props.props.label]
    const renderContent = props.renderContent  
    let spouse = {}
    let className = 'org-tree-node-label'
  
     
    // event handlers
    const clickHandler = listeners['on-node-click']
    const mouseOverHandler = listeners['on-node-mouseover']
    const mouseOutHandler = listeners['on-node-mouseout']
  
    const childNodes = []
    if (typeof renderContent === 'function') {
 
      let vnode = renderContent(h, data)
      vnode && childNodes.push(vnode)
    } else {
      childNodes.push(label)
    }
  
    if(!data[props.props.couple]){
 
      if (props.collapsable && !isLeaf(data, props.props.children)) {
        childNodes.push(renderBtn(h, data, context))
      }
    }
  
    const cls = ['org-tree-node-label-inner']
    let { labelWidth, labelClassName, selectedClassName, selectedKey } = props
  
    if (typeof labelWidth === 'number') {
      labelWidth += 'px'
    }
  
    if (typeof labelClassName === 'function') {
      labelClassName = labelClassName(data)
    }
  
    labelClassName && cls.push(labelClassName)
  
    // add selected class and key from props
    if (typeof selectedClassName === 'function') {
      selectedClassName = selectedClassName(data)
    }
  
    selectedClassName && selectedKey && data[selectedKey] && cls.push(selectedClassName)
  
    return h('div', {
      domProps: {
        className: className
      }
    }, [h('div', {
      domProps: {
        className: cls.join(' ')
      },
      style: { width: labelWidth },
      on: {
        'click': e => clickHandler && clickHandler(e, data),
        'mouseover': e => mouseOverHandler && mouseOverHandler(e, data),
        'mouseout': e => mouseOutHandler && mouseOutHandler(e, data)
      }
    }, childNodes)])
  }
  
  // 创建 node 子节点
  export const renderChildren = (h, list, context) => {
    if (Array.isArray(list) && list.length) {
      const children = list.map(item => {
        return renderNode(h, item, context)
      })
       
      return h('div', {
        domProps: {
          className: 'org-tree-node-children'
        }
      }, children)
    }
    return ''
  }
  
  export const render = (h, context) => {
    const {props} = context
  
    
    return renderNode(h, props.data, context)
  }
  
  export default render
  