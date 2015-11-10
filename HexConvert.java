
public class HexConvert {

	// 基数。今回は16進数なので16
	final static int HEX = 16;

	/**
	 * 15以下の10進数を与えると16進数に変換する処理
	 * @param x
	 * @return
	 */
	private static String hex(int x){
		if(x < 10){
			return Integer.toString(x);
		}else if(x == 10){
			return "A";
		}else if(x == 11){
			return "B";
		}else if(x == 12){
			return "C";
		}else if(x == 13){
			return "D";
		}else if(x == 14){
			return "E";
		}else if(x == 15){
			return "F";
		}else{
			return "X";
		}
	}


	/**
	 * メイン関数
	 * @param args
	 */
	public static void main(String[] args) {

		// 表示する16進数を格納する
		String res;

		// 作業用変数
		int buf, base;

		// 0〜256までのループを回す（出力したい10進数の範囲）
		for(int num = 0; num <= 256; num++){
			res = "";
			base = num;

			// 2乗数、1乗、0乗・・・と順番に数を求める
			for(int index = 2; index >= 0; index--){
				buf = base / (int)Math.pow(HEX, index);
				base = base % (int)Math.pow(HEX, index);

				res = res + HexConvert.hex(buf);
			}

			// 10進数の値とそれに対応する16進数を出力する
			System.out.println(num + ": " + res);
		}
	}

}
