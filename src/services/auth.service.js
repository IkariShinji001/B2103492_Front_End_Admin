import api from "./api.service";

class AuthService{
  async signOut(){
    try {
      await api.get('auth/sign-out');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async verifyAccessToken(){
    try {
      const result = await api.get('auth/verify/access-token');
      if(result.data.isVerified){
        return result.data.isVerified;
      }else{
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();