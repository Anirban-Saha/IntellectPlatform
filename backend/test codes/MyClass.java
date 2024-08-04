import java.util.*;
public class MyClass {
    int Fib(int n) {
        if(n <= 1){
            return n;
        }
        else {
            return (Fib(n-1)+Fib(n-2));
        }
    }
    public static void main(String args[]) {
        MyClass obj = new MyClass();
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = obj.Fib(n);
        System.out.println(k);
        sc.close();
    }
}