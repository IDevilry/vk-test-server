export interface IUser {
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  password: string;
  age?: number;
  profile_photo?: string;
  city?: string;
  institution?: string;
}

export interface IPost {
  user: string;
  title?: string;
  content: string;
  image?: string;
  likes?: IUser[];
}
