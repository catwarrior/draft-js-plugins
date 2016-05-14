import React, { Component } from 'react';
import PluginsEditor from 'draft-js-plugins-editor';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';
import ReactDOM from 'react-dom';

export default class DraftEditorBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.editorState
        ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromRaw(props.editorState)))
        : EditorState.createWithContent(ContentState.createFromText('Insert text ...'))
    };
  }

  componentDidMount() {
    this.DOMNode = ReactDOM.findDOMNode(this.refs.editor);
    this.DOMNode.addEventListener('mousedown', this.mouseDown, false);
    this.DOMNode.addEventListener('keydown', this.stopPropagation, false);
  }

  componentWillUnmount() {
    this.DOMNode.removeEventListener('mousedown', this.listener, false);
    this.DOMNode.removeEventListener('keydown', this.stopPropagation, false);
  }

  onChange = editorState => {
    const { readOnly } = this.props;
    if (readOnly) return;
    this.setState({ editorState });
    this.props.onChange(convertToRaw(editorState.getCurrentContent()));
  }

  mouseDown = event => {
    const { readOnly, setFocus } = this.props;
    event.stopPropagation();
    if (readOnly === false) {
      return;
    }

    setFocus();
  }

  stopPropagation = event => {
    if (event.keyCode === 38) {
      event.stopPropagation();
    } else if (event.keyCode === 40) {
      event.stopPropagation();
    } else if (event.keyCode === 8) {
      event.stopPropagation();
    }
  }

  render() {
    const { editorState } = this.state;
    const { readOnly } = this.props;

    return (
      <PluginsEditor {...this.props} ref="editor" editorState={editorState} onChange={this.onChange} readOnly={readOnly} />
    );
  }
}