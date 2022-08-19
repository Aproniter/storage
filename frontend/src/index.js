import React from 'react';
import ReactDOM from 'react-dom/client';
import Slider from 'react-slick';
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
            documentImages: [],
            documentsIsVisible: false,
            notesIsVisible: false,
            downloading: false
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
                    notesIsVisible: true,
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
    handleDownload(project, chapter, filename){
        fetch(
            API_ROOT+'/api/v1/get_file/'+project+'/'+chapter+'/'
        ).then(res => new Promise((resolve, reject) => {
            if (res.status < 400) {
              return res.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename+'.pdf';
                document.body.appendChild(a);
                a.click();    
                a.remove();
              })
            }
            reject()
          }))
    }
    handleImages(project, chapter){
        if(!this.state.documentsIsVisible){
            this.setState({
                downloading: true,
            })
            fetch(API_ROOT+'/api/v1/get_preview/'+project+'/'+chapter+'/'
            ).then(res => res.json())
            .then(
            (result) => {
                this.setState({
                isLoaded: true,
                documentImages: result.files,
                notesIsVisible: true,
                documentsIsVisible: true,
                downloading: false,
                });
            },
            (error) => {
                this.setState({
                isLoaded: true,
                downloading: false,
                documentsIsVisible: false,
                error
                });
            }
            );
        } else {
            this.setState({
                documentImages: [],
                documentsIsVisible: false
            })
        }
    }
    render() {
        let className = 'notes';
        if((this.props.value.notes).length !== 0) {
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
        let images
        if(this.state.documentImages){
            const data = [].concat(this.state.documentImages)
            .sort((a,b) => a.id - b.id);
            const settings = {
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                swipeToSlide: true,
                slidesToScroll: 1,
                appendDots: dots => (
                    <div
                      style={{
                        backgroundColor: '#e5cba4',
                        borderRadius: '2px',
                        padding: '10px'
                      }}
                    >
                      <ul style={{margin:'0px'}}> {dots} </ul>
                    </div>
                  ),
                  customPaging: i => (
                    <div
                      style={{
                        width: '30px',
                        // color: 'blue',
                        border: "1px blue solid"
                      }}
                    >
                      {i + 1}
                    </div>
                  )
            };
            images = (
            <div className='slider'>
                <Slider {...settings}>
                    {data.map((item, idx) => (
                    <div key={item.id} className='slide'>
                        <a style={{width:'100%'}} rel="noreferrer" target='_blank' href={API_ROOT + '/media/' + item.data}><img src={API_ROOT + '/media/' + item.data} alt='' height='100%'/></a>
                    </div>
                    ))}
                </Slider>
            </div>
            )
        }
        let downloading
        if(this.state.downloading){
            downloading = <div className='downloading'></div>
        } else {
            downloading = ''
        }
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div
                    className='chapter'
                    key={this.props.value.id}
                >
                    <h4>{this.props.value.title}</h4>
                    <div className='tools'>
                        <div data-tooltip='Предпросмотр'>
                            <svg
                                className='viewing'
                                onClick={() => this.handleImages(this.props.project_id, this.props.value.id)}
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><g id="_01_align_center" data-name="01 align center"><path d="M24,22.586l-6.262-6.262a10.016,10.016,0,1,0-1.414,1.414L22.586,24ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/></g>
                            </svg>
                        </div>
                        <div data-tooltip='Показать/скрыть заметки'>
                            <svg
                                className={className}
                                onClick={
                                    (this.props.value.notes).length !== 0 
                                    ? () => this.handleClick(this.props.value.notes) 
                                    : () => false
                                }
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                            </svg>
                        </div>
                        <div data-tooltip='Скачать документ'>
                            <svg 
                                className='download'
                                onClick={
                                    () =>
                                    this.handleDownload(this.props.project_id, this.props.value.id, this.props.value.title)
                                }
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z"/><path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                {notes}
                {images}
                {downloading}
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
        let notesClass = 'notes'
        if((this.props.value.notes).length !== 0) {
            notesClass += ' haveNotes';
        }
        if(this.state.projectChapters){
            chapters = this.state.projectChapters.map(item => (
                <Chapter key={item.id}
                    value={item}
                    project_id={this.props.value.id}
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
            <div className='project_row'>
                <div className='project_row_header'>
                    <span className='project_title'><p>{this.props.value.title}</p></span>
                    <span className='project_stage'><p>{this.props.value.status}</p></span>
                    <span className='project_address'><p>{this.props.value.address}</p></span>
                    <span className='project_updated_at'><p>{this.props.value.updated_at}</p></span>
                    <span className='project_owner'><p>{this.props.value.owner.first_name} {this.props.value.owner.last_name}</p></span>
                    <div className='project_buttons'>
                        <div data-tooltip='Показать/скрыть заметки'>
                            <svg
                                className={notesClass}
                                onClick={
                                    ((this.props.value.notes).length !== 0) 
                                    ? () => this.handleGetNotes(this.props.value.notes) 
                                    : () => false
                                }
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M20,0H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4H6.9l4.451,3.763a1,1,0,0,0,1.292,0L17.1,20H20a4,4,0,0,0,4-4V4A4,4,0,0,0,20,0Zm2,16a2,2,0,0,1-2,2H17.1a2,2,0,0,0-1.291.473L12,21.69,8.193,18.473h0A2,2,0,0,0,6.9,18H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H20a2,2,0,0,1,2,2Z"/><path d="M7,7h5a1,1,0,0,0,0-2H7A1,1,0,0,0,7,7Z"/><path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/><path d="M17,13H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Z"/>
                            </svg>
                        </div>
                        <div data-tooltip='Показать/скрыть разделы'>
                            <svg
                                className='project_chapters'
                                onClick={() => this.handleGetChapter(this.props.value.id)}
                                xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M1,6H23a1,1,0,0,0,0-2H1A1,1,0,0,0,1,6Z"/><path d="M23,9H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,19H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/><path d="M23,14H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='project_other_data'>
                    {notes}
                    {chapters}
                </div>
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
                <div className='projects_list'>
                    {projects.map(item => (
                        this.renderProject(item)
                    ))}
                </div>
            );
        }
    }
}

class Table extends React.Component {
    render() {
        return(
            <div className='container'>
                <Board />
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Table />)