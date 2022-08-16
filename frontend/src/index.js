import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const API_ROOT = 'http://127.0.0.1:8000'

class Note extends React.Component {
    render() {
        let className = 'note';
        return (
            <div
            className={className}
            key={this.props.value.id}>
                <h4>{this.props.value.title}</h4>
            </div>
        );
    }
}

class Chapter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            chapterNotes: [],
            notesIsVisible: false,
        };
    }
    handleClick(item){
        if(!this.state.notesIsVisible){
            fetch(API_ROOT+'/api/v1/notes/?ids='+item)
              .then(res => res.json())
              .then(
                (result) => {
                  this.setState({
                    isLoaded: true,
                    chapterNotes: result,
                    notesIsVisible: true
                  });
                },
                (error) => {
                  this.setState({
                    isLoaded: true,
                    error
                  });
                }
              );
        } else {
            this.setState({
                chapterNotes: [],
                notesIsVisible: false
            })
        }
    }
    render() {
        let className = 'chapter';
        if(this.props.value.notes) {
            className += ' haveNotes'
        }
        let notes = []
        if(this.state.chapterNotes){
            notes = this.state.chapterNotes.map(item => (
                <Note key={item.id}
                    value={item}
                />
            ))
        }
        return (
            <div
            className={className}
            key={this.props.value.id}>
                <h4>{this.props.value.title}</h4>
                <p
                onClick={() => this.handleClick(this.props.value.notes)}
                >Заметки
                </p>
            {notes}
            </div>
        );
    }
}

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            projectChapters: [],
            projectNotes:[],
            chaptersIsVisible: false,
            notesIsVisible: false,
        };
    }
    handleGetChapter(item) {
        if(!this.state.chaptersIsVisible){
        fetch(API_ROOT+'/api/v1/chapters/?project='+item)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                projectChapters: result,
                chaptersIsVisible: true
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          );
        } else {
            this.setState({
                projectChapters: [],
                chaptersIsVisible: false
            })
        }
    }
    handleGetNotes(items){
        if(!this.state.notesIsVisible){
            fetch(API_ROOT+'/api/v1/notes/?ids='+items)
              .then(res => res.json())
              .then(
                (result) => {
                  this.setState({
                    isLoaded: true,
                    projectNotes: result,
                    notesIsVisible: true
                  });
                },
                (error) => {
                  this.setState({
                    isLoaded: true,
                    error
                  });
                }
              );
        } else {
            this.setState({
                projectNotes: [],
                notesIsVisible: false
            })
        }
    }
    render() {
        let chapters = []
        let notes = []
        let notesClass = 'projectNotes'
        if(this.props.value.notes) {
            notesClass += ' haveNotes';
        }
        if(this.state.projectChapters){
            chapters = this.state.projectChapters.map(item => (
                <Chapter key={item.id}
                    value={item}
                />
            ));
        }
        if(this.state.projectNotes){
            notes = this.state.projectNotes.map(item => (
                <Note key={item.id}
                    value={item}
                />
            ));
        }
        return (
            <div>
                <div 
                    className='project'
                    onClick={() => this.handleGetChapter(this.props.value.id)}
                >
                    <h2>{this.props.value.title}</h2>
                    <h3>{this.props.value.owner.first_name}</h3>
                    
                </div>
                <div 
                    className={notesClass}
                    onClick={() => this.handleGetNotes(this.props.value.notes)}
                >
                    <p>Заметки</p>
                </div>
                {notes}
                {chapters}
            </div>
        );
    }
}


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }
    
    renderProject(item) {
        return (
            <Project key={item.id}
                value={item}
            />
        );
    }
    componentDidMount() {
        fetch(API_ROOT+'/api/v1/projects/')
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                projects: result
              });
            },            
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }

    render() {
        const { error, isLoaded, projects} = this.state;
        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else {
            return (
                <ul>
                    {projects.map(item => (
                        <div>
                            {this.renderProject(item)}
                        </div>
                    ))}
                </ul>
            );
        }
    }
}

class Table extends React.Component {
    render() {
        return(
            <div className='projects-table'>
                <div className='projects-table-board'>
                    <Board />
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Table />)