declare module "Types" {
    export type ThemeTypes = "get" | "set" | "getBool" | "toggle";

    export type ThemeModes = "dark" | "light";

    export interface DemoProps {
        store: any,
        history: any
    }

    export interface AppProps {
        AuthStore: any
    }

    export type CheckboxType = {
        name: string,
        form?: any,
        value: string
    }
    
    export interface CommentsProps {
        store: any,
        FullPostStore?: any,
        id: string,
        commentId?: string,
        hasComments: boolean
    }

    export type DropdownType = {
        className?: string,
        message?: string,
        errorMessage?: string,
        store?: any,
        form?: any,
        name?: string
    }

    export type FileType = {
        message?: string,
        errorMessage?: string,
        name?: string,
        form?: any,
        className?: string,
        onChange?: any,
        selectedFile?: any
    }

    export type FollowersType = {
        type?: string,
        store?: any,
        exitScreen?: any
    }

    export type FormType = {
        onSubmit?: any,
        onCancel?: any,
        children?: Array<any>,
        form?: any,
        className?: string
    }

    export type FormGroupType = {
        children?: Array<any>,
        form?: any,
        className?: string
    }
    
    export type IngredientType = {
        form?: any,
        i: number,
        name: string 
    }
    
    export type InputType = {
        message?: string,
        errorMessage?: string,
        name?: string,
        form?: any,
        className?: string,
        autoFocus?: boolean
    }

    export interface NavbarProps {
      AuthStore: any,
      location: any
    }
    
    export type NewCommentType = {
        store: any
    }
    
    export interface NewPostProps {
        NewPostStore?: any,
        history?: any
    }
    
    export type PopoverType = {
        store: any,
        username: string,
        iter: number
    }

    export type PostType = {
        post: any,
        iter: number,
        userdata: any,
        togglePoint: any,
        authUser: any,
        from: any,
        removePost: any,
        isAuth: boolean
    }
    
    export type RadioType = {
        name?: string,
        form?: any,
        value?: string
    }
    
    export type SearchType = {
        className?: string,
        store?: any,
    }
    
    export type SwitchType = {
        store: any
    }

    export type TextAreaType = {
        message?: string,
        errorMessage?: string,
        name?: string,
        form?: any,
        className?: string,
        autoFocus?: boolean
    }

    export type EditPostProps = {
        EditPostStore?: any;
        match?: any;
        history?: any;
    }

    export type EditProfileProps = {
      EditProfileStore?: any;
      history?: any;
    }

    export type ExploreProps = {
        ExploreStore?: any;
    }

    export type ExploreCategoryProps = {
        ExploreCategoryStore?: any;
        match?: any;
    }

    export type FeedProps = {
        FeedStore?: any;
    }

    export type FullPostProps = {
        match?: any;
        history?: any;
        FullPostStore?: any;
    }

    export type LoginProps = {
        LoginStore?: any;
        history?: any
    }

    export type ProfileProps = {
        match?: any;
        history?: any;
        ProfileStore?: any;
    }

    export type RegisterProps = {
      RegisterStore: any;
      history: any;
    }
    
} 
