import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { IPost } from './@types/IPost';

const apolloQuery = gql`
  query {
    posts {
      id
      title
      views
    }
  }
`;

const apolloMutate = gql`
  mutation createPost($title: String!, $views: Int!) {
    insert_posts_one(object: { title: $title, views: $views }) {
      id
      title
      views
    }
  }
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = '';
  views: number = 0;
  listPosts: IPost[] = [];

  constructor(private apollo: Apollo) {
    // const a: any = {};
    // a['list'] = [];
    // a['list'].push('aaaaaaa');
    // a['list'].push('bbbbbbb');
    // console.log('[a data]', a);
    // KNOW ABOUT MUTABLE DATA
    // const b: any = Object.freeze({});
    // b['list'] = [];
    // b['list'].push('bbbbb');
  }
  ngOnInit(): void {
    this.apollo
      .watchQuery<{ posts: IPost[] }>({ query: apolloQuery })
      .valueChanges.subscribe(({ data }) => {
        console.log('[query]', data.posts);
        this.listPosts = data.posts;
      });
  }

  handleAddNewPost() {
    this.apollo
      .mutate<{ insert_posts_one: IPost }>({
        mutation: apolloMutate,
        variables: {
          title: this.title,
          views: this.views,
        },
      })
      .subscribe(({ data }) => {
        console.log('[mutation]', data?.insert_posts_one);
        this.listPosts = [...this.listPosts, data?.insert_posts_one as IPost];
      });
  }
}
