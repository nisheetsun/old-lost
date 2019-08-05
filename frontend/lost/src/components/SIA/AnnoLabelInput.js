import React, {Component} from 'react'
import LabelInput from './LabelInput'
import * as transform from './utils/transform'
import * as constraints from './utils/constraints'
import * as annoStatus from './types/annoStatus'

class AnnoLabelInput extends Component{

    constructor(props){
        super(props)
        this.state = {
            top: 400,
            left: 100,
            label: undefined,
            visibility: 'hidden',
            possibleLabels: []
        }
        this.inputGroupRef = React.createRef()
    }

    componentWillMount(){
        this.setPosition()
    }
    
    componentDidUpdate(prevProps){
        if (this.props.visible){
            console.log('ShowLabelInput')
            this.setPosition()
        } 

        
    }

    /*************
     * LOGIC     *
     *************/
    setPosition(){
        if (this.props.selectedAnno.id){
            const center = transform.getCenter(this.props.selectedAnno.data, this.props.selectedAnno.type)
            // const annoBox = transform.getBox(this.props.selectedAnno.anno, this.props.selectedAnno.type)
            const inputRect = this.inputGroupRef.current.getBoundingClientRect()
            const top = this.props.svg.top + center.y - 20
            let left = this.props.svg.left + center.x - inputRect.width /2.0
            if (left < this.props.svg.left) left = this.props.svg.left
            if (left+inputRect.width > this.props.svg.left+this.props.svg.width){
                console.log('labelinput right, svg right', left+inputRect.width, this.props.svg.left+this.props.svg.width)
                left = this.props.svg.left+this.props.svg.width - inputRect.width
                console.log('labelinput new left', left)
            }
            if (this.state.top !== top || this.state.left !== left){  
                this.setState({
                    top,
                    left
                })
            }
        }
    }

    onClose(){
        if (this.props.onClose){
            this.props.onClose()
        }
    }
    
    annoLabelUpdate(anno){
        if (this.props.onLabelUpdate){
            this.props.onLabelUpdate(anno)
        }
    }

    updateAnnoLabel(label){
        if (!constraints.allowedToLabel(
            this.props.allowedActions, this.props.selectedAnno)) return
        console.log('LabelInput confirmLabel label', label)
        if (label){
            if (label.value !== -1){
                this.annoLabelUpdate({
                    ...this.props.selectedAnno,
                    labelIds: [label.value],
                    status: this.props.selectedAnno.status !== annoStatus.NEW ? annoStatus.CHANGED : annoStatus.NEW
                })
            } else {
                this.annoLabelUpdate({
                    ...this.props.selectedAnno,
                    labelIds: [],
                    status: this.props.selectedAnno.status !== annoStatus.NEW ? annoStatus.CHANGED : annoStatus.NEW
                })
            }
        } else {
            this.annoLabelUpdate({
                ...this.props.selectedAnno,
                labelIds: [],
                status: this.props.selectedAnno.status !== annoStatus.NEW ? annoStatus.CHANGED : annoStatus.NEW
            })
        }
    }


    /*************
     * RENDERING *
    **************/
    render(){
        return (
            <div ref={this.inputGroupRef} style={{position:'fixed', top:this.state.top, left:this.state.left}}>
                <LabelInput svg={this.props.svg}
                    onClose={() => this.onClose()}
                    initLabelIds={this.props.selectedAnno.labelIds}
                    relatedId={this.props.selectedAnno.id}
                    visible={this.props.visible}
                    onLabelUpdate={anno => this.updateAnnoLabel(anno)}
                    possibleLabels={this.props.possibleLabels}
                    renderPopup
                    focusOnRender
                    />
            </div>
        )
    }
    
}

export default AnnoLabelInput