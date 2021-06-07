import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { IPost } from './@types/IPost';

const apolloQuery = gql`
  query {
    allPosts {
      id
      title
      views
    }
  }
`;

const apolloMutate = gql`
  mutation create($title: String!, $views: Int!) {
    createPost(title: $title, views: $views) {
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
    const a: any = {};
    a['list'] = [];
    a['list'].push('aaaaaaa');
    a['list'].push('bbbbbbb');
    console.log('[a data]', a);

    // KNOW ABOUT MUTABLE DATA
    // const b: any = Object.freeze({});
    // b['list'] = [];
    // b['list'].push('bbbbb');
  }
  ngOnInit(): void {
    this.apollo
      .watchQuery<{ allPosts: IPost[] }>({ query: apolloQuery })
      .valueChanges.subscribe(({ data }) => {
        console.log('[query]', data.allPosts);
        this.listPosts = data.allPosts;
      });
  }

  handleAddNewPost() {
    this.apollo
      .mutate<{ createPost: IPost }>({
        mutation: apolloMutate,
        variables: {
          title: this.title,
          views: this.views,
        },
      })
      .subscribe(({ data }) => {
        console.log('[mutation]', data?.createPost);
        this.listPosts = [...this.listPosts, data?.createPost as IPost];
      });
  }
}
