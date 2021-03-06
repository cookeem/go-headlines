import React from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Stars from '@material-ui/icons/Stars';
import AddCircle from '@material-ui/icons/AddCircle';
import ControlPoint from '@material-ui/icons/ControlPoint';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

import { mapDispatchToProps, mapStateToProps } from './redux/react';
import { connect } from 'react-redux';
import { serviceQuery } from './components/functions';
import { LoadingView } from './components/loading';

import { backendUri } from './config';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit * 2,
  },
  card: {
    minWidth: 400,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class GitRepoViewForm extends React.Component {
  constructor(props) {
    super(props);
    this.getGitRepo(props.gid);
  }

  state = {
    showComment: false,
    showDelete: false,
    showAdapt: false,
    showFollow: false,
    content: "",
    contentPrompt: "",
    ridDelete: 0,
  };

  getGitRepo = (gid) => {
    const cookies = new Cookies();
    this.props.onLoading(true);
    const userToken = cookies.get('user-token');
    const axiosConfig = {
      url: backendUri+'/gitrepos/' + gid,
      method: 'get',
      headers: {'x-user-token': userToken, },
      timeout: 5000,
    };
    const axiosSuccess = (obj, response) => {
      obj.onGitRepo(response.data.gitrepo);
      obj.onReviews(response.data.reviews);
    };
    const axiosFail = (obj, response) => {
      window.location.href = "/#/gitrepo-list";
    };
    serviceQuery(this.props, axiosConfig, axiosSuccess, axiosFail);
  };

  createReview = (gid, content) => {
    var contentPrompt = "";
    if (this.state.content == "") {
      contentPrompt = "content can not be empty";
    } else if (this.state.content.length < 3) {
      contentPrompt = "content must more than 2 characters";
    }
    this.setState({ contentPrompt: contentPrompt });

    if (contentPrompt == "") {
      const cookies = new Cookies();
      this.props.onLoading(true);
      const userToken = cookies.get('user-token');
      var bodyFormData = new FormData();
      bodyFormData.append('gid', gid);
      bodyFormData.append('content', content);
      const axiosConfig = {
        url: backendUri+'/reviews/',
        method: 'post',
        data: bodyFormData,
        headers: {'x-user-token': userToken, },
        config: { headers: {'Content-Type': 'multipart/form-data' }},
        timeout: 5000,
      };
      const axiosSuccess = (obj, response) => {
        this.props.onGitRepo({});
        this.props.onReviews([]);
        this.getGitRepo(this.props.gid);
        this.onShowComment(false);
        // window.location.reload();
      };
      const axiosFail = (obj, response) => {
      };
      serviceQuery(this.props, axiosConfig, axiosSuccess, axiosFail);
    }
  };

  deleteReview = (rid) => {
    const cookies = new Cookies();
    this.props.onLoading(true);
    const userToken = cookies.get('user-token');
    var bodyFormData = new FormData();
    bodyFormData.append('rid', rid);
    const axiosConfig = {
      url: backendUri+'/reviews/',
      method: 'delete',
      data: bodyFormData,
      headers: {'x-user-token': userToken, },
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      timeout: 5000,
    };
    const axiosSuccess = (obj, response) => {
      this.props.onGitRepo({});
      this.props.onReviews([]);
      this.getGitRepo(this.props.gid);
      this.onShowDelete(false, 0);
      // window.location.reload();
    };
    const axiosFail = (obj, response) => {
    };
    serviceQuery(this.props, axiosConfig, axiosSuccess, axiosFail);
  };

  adaptGitRepo = (gid) => {
    const cookies = new Cookies();
    this.props.onLoading(true);
    const userToken = cookies.get('user-token');
    var bodyFormData = new FormData();
    bodyFormData.append('gid', gid);
    const axiosConfig = {
      url: backendUri+'/reviews/adapt/',
      method: 'post',
      data: bodyFormData,
      headers: {'x-user-token': userToken, },
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      timeout: 5000,
    };
    const axiosSuccess = (obj, response) => {
      this.props.onGitRepo({});
      this.props.onGitRepos([]);
      this.getGitRepo(this.props.gid);
      this.onShowAdapt(false);
      // window.location.reload();
    };
    const axiosFail = (obj, response) => {
    };
    serviceQuery(this.props, axiosConfig, axiosSuccess, axiosFail);
  };

  followGitRepo = (gid) => {
    const cookies = new Cookies();
    this.props.onLoading(true);
    const userToken = cookies.get('user-token');
    var bodyFormData = new FormData();
    bodyFormData.append('gid', gid);
    const axiosConfig = {
      url: backendUri+'/reviews/follow/',
      method: 'post',
      data: bodyFormData,
      headers: {'x-user-token': userToken, },
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      timeout: 5000,
    };
    const axiosSuccess = (obj, response) => {
      this.props.onGitRepo({});
      this.props.onGitRepos([]);
      this.getGitRepo(this.props.gid);
      this.onShowFollow(false);
      // window.location.reload();
    };
    const axiosFail = (obj, response) => {
    };
    serviceQuery(this.props, axiosConfig, axiosSuccess, axiosFail);
  };

  onShowComment = (show) => {
    this.setState({
      showComment: show,
      content: "",
      contentPrompt: "",
    });
  }

  onShowDelete = (show, ridDelete) => {
    this.setState({
      ridDelete: ridDelete,
      showDelete: show,
    });
  }

  onShowAdapt = (show) => {
    this.setState({
      showAdapt: show,
    });
  }

  onShowFollow = (show) => {
    this.setState({
      showFollow: show,
    });
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Dialog
          style={{zIndex: 100}}
          open={this.state.showComment}
          onClose={() => this.onShowComment(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="comment">Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please left your github repository comment here
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="content"
              label="Comment"
              multiline
              rows={3}
              rowsMax={6}
              fullWidth
              onChange={this.handleChange}
              error={this.state.contentPrompt != ""}
              helperText={this.state.contentPrompt} 
            />
          </DialogContent>
          <DialogActions>
            <Button id="comment_send" onClick={() => this.createReview(this.props.gid, this.state.content)} color="secondary">
              Comment
            </Button>
            <Button id="comment_cancel" onClick={() => this.onShowComment(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          style={{zIndex: 100}}
          open={this.state.showDelete}
          onClose={() => this.onShowDelete(false, 0)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Do you want to delete this comment?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Comment can not recover after delete, are you sure want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="delete_send" onClick={() => this.deleteReview(this.state.ridDelete)} color="secondary" style={{color: "#FF0000"}}>
              Delete
            </Button>
            <Button id="delete_cancel" onClick={() => this.onShowDelete(false, 0)} color="secondary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          style={{zIndex: 100}}
          open={this.state.showAdapt}
          onClose={() => this.onShowAdapt(false, 0)}
          aria-labelledby="adapt-dialog-title"
          aria-describedby="adapt-dialog-description"
        >
          <DialogTitle id="adapt-dialog-title">Do you want to adapt this github repository?</DialogTitle>
          <DialogContent>
            <DialogContentText id="adapt-dialog-description">
              Do you want to adapt this github repository?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="adapt_send" onClick={() => this.adaptGitRepo(this.props.gid)} color="secondary" style={{color: "#FF0000"}}>
              Adapt
            </Button>
            <Button id="adapt_cancel" onClick={() => this.onShowAdapt(false, 0)} color="secondary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          style={{zIndex: 100}}
          open={this.state.showFollow}
          onClose={() => this.onShowFollow(false, 0)}
          aria-labelledby="follow-dialog-title"
          aria-describedby="follow-dialog-description"
        >
          <DialogTitle id="follow-dialog-title">Do you want to follow this github repository?</DialogTitle>
          <DialogContent>
            <DialogContentText id="follow-dialog-description">
              Do you want to follow this github repository?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="follow_send" onClick={() => this.followGitRepo(this.props.gid)} color="secondary" style={{color: "#FF0000"}}>
              Follow
            </Button>
            <Button id="follow_cancel" onClick={() => this.onShowFollow(false, 0)} color="secondary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {
          (this.props.ui.showLoading) ? (
            <LoadingView />
          ) : (
            <Grid key={this.props.gitrepo.gitrepo.gid} container spacing={8} alignItems="flex-end" justify="flex-start">
              <Grid item xs={12}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {this.props.gitrepo.gitrepo.full_name}
                    </Typography>
                    { this.props.gitrepo.gitrepo.language != "" && (
                      <Chip label={this.props.gitrepo.gitrepo.language} className={classes.chip} color="primary"/>
                    )}
                    <Chip
                      icon={<Stars />}
                      label={"stars "+this.props.gitrepo.gitrepo.stargazers_count}
                      className={classes.chip}
                      color="secondary"
                      style={{color: "#FFF"}}
                    />
                    <Chip
                      icon={<ControlPoint />}
                      label={"forks "+this.props.gitrepo.gitrepo.forks_count}
                      className={classes.chip}
                      color="default"
                    />
                    <Chip
                      label={"watchers "+this.props.gitrepo.gitrepo.watchers_count}
                      className={classes.chip}
                      color="default"
                    />
                    <Chip
                      label={"issues "+this.props.gitrepo.gitrepo.open_issues_count}
                      className={classes.chip}
                      color="default"
                    />
                    <Typography className={classes.pos} color="textSecondary">
                      {this.props.gitrepo.gitrepo.description}
                    </Typography>
                    <Typography component="p">
                      <a href="#">{this.props.gitrepo.gitrepo.html_url}</a>
                    </Typography>
      
      
                    <Chip
                      label={"created at: "+this.props.gitrepo.gitrepo.created_at}
                      className={classes.chip}
                      color="default"
                    />
                    <Chip
                      label={"updated at: "+this.props.gitrepo.gitrepo.updated_at}
                      className={classes.chip}
                      color="default"
                    />
                    <Chip
                      label={"pushed at: "+this.props.gitrepo.gitrepo.pushed_at}
                      className={classes.chip}
                      color="default"
                    />
                  </CardContent>
                  <CardActions>
                    <Button id="comment_button" size="small" variant="contained" color="secondary" className={classes.pos} style={{color: "#FFF"}} onClick={() => this.onShowComment(true)}>
                      <AddCircle />
                      Comments ({this.props.gitrepo.gitrepo.reviews_count})
                    </Button>
                    { 
                      (this.props.gitrepo.gitrepo.adapt == 0) ? (
                        <Button id="adapt_button" size="small" variant="contained" color="primary" className={classes.pos} onClick={() => this.onShowAdapt(true)}>
                          <AddCircle />
                          Adapt ({this.props.gitrepo.gitrepo.adapts_count})
                        </Button>
                      ) : (
                        <Button id="adapt_button" size="small" variant="contained" color="default" className={classes.pos}>
                          <AddCircle />
                          Adapt ({this.props.gitrepo.gitrepo.adapts_count})
                        </Button>
                      ) 
                    }
                    { 
                      (this.props.gitrepo.gitrepo.follow == 0) ? (
                        <Button id="follow_button" size="small" variant="contained" color="primary" className={classes.pos} onClick={() => this.onShowFollow(true)}>
                          <AddCircle />
                          follow ({this.props.gitrepo.gitrepo.follows_count})
                        </Button>
                      ) : (
                        <Button id="follow_button" size="small" variant="contained" color="default" className={classes.pos}>
                          <AddCircle />
                          follow ({this.props.gitrepo.gitrepo.follows_count})
                        </Button>
                      ) 
                    }
                  </CardActions>
                </Card>
              </Grid>
            </Grid>  
          )
        }
        {this.props.reviews.reviews.map((review, _) => (
          <Grid key={review.rid} container spacing={8} alignItems="flex-end" justify="flex-start">
            <Grid item xs={12}>
              <Card className={classes.card} style={{backgroundColor: grey[100]}}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {review.username}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {review.content}
                  </Typography>
                  { review.uid == this.props.login.uid && (
                    <Typography component="p">
                      {review.created_at}
                      <Button size="small" variant="contained" style={{marginLeft: 20, backgroundColor: red[500], color: "#FFF"}} onClick={() => this.onShowDelete(true, review.rid)}>
                        Delete
                      </Button>
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>  
        ))}
      </div>
    );
  }
}

GitRepoViewForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const GitRepoViewFormConnect = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GitRepoViewForm));

function GitRepoViewPage(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24} justify="center" style={{height: 60}}>
        <Grid item xs={10}>
          <GitRepoViewFormConnect gid={props.gid}/>
        </Grid>
      </Grid>
    </div>
  );
}
  
GitRepoViewPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const GitRepoViewPageStyle = withStyles(styles)(GitRepoViewPage);

//需要传递match参数，不能使用React.Component
export const GitRepoViewView = (props) => {
  return (
    <GitRepoViewPageStyle
      gid={props.match.params.gid}
      {...props}
    />
  );
}
