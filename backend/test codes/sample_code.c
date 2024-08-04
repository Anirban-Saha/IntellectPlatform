//Fibonacci Series using Recursion
/*
#include<stdio.h>

int fib(int n)
{
    if (n <= 1)
        return n;
    return fib(n-1) + fib(n-2);
}
int main ()
{
    int n;
    scanf("%d",&n);
    printf("%d\n", fib(n));
    return 0;
}
*/
/*
void main()
{
    printf("Hello world!\n");
}
*/
//Some code from codechef problem
/*
#include <stdio.h>

int main(void) 
{
	int t,i,temp[4];
	t=1;
	while(t--)
	{
	    int ans=2,flag=0,c[11]={0};
	    for(i=0;i<4;i++)
	        scanf("%d",&temp[i]);
	    for(i=0;i<4;i++)
	        c[temp[i]]+=1;
	    for(i=0;i<11;i++)
	    {
	        if(c[i]==2)
	        {
	            flag=1;
	            break;
	        }
	        else if(c[i]==3)
	        {
	            flag=2;
	            break;
	        }
	        else if(c[i]==4)
	        {
	            flag=3;
	            break;
	        }
	    }
	    if(flag<=1)
	        ans=2;
	    else if(flag==2)
	        ans=1;
	    else 
	        ans=0;
	    printf("%d\n",ans);
	}
	return 0;
}
*/
//CHEFORA from codechef
/*
#include <stdio.h>
#include <string.h>
#define mod 1000000007

long long int B[100000];
long long int S[100000];

long long int modexp(long long int x, long long int y)
{
    x=x%mod;
    long long int p=1;
    
    if(x==0)
        return 0;
    
    while(y>0)
    {
        if(y&1)
            p=(p*x)%mod;
        y=y>>1;
        x=(x*x)%mod;
    }
    return p;
}

long long int solve(long long int L)
{
    long long int i,n,x;
    char l[100000];
    sprintf(l, "%lld", L);
    n=strlen(l);
    char b[(2*n)-1];
    for(i=0;i<n;i++)
    {
        b[i]=l[i];
        b[n+i-1]=l[n-i-1];
    }
    sscanf(b, "%lld", &x);
    return x;
}

void prop_solve()
{
    long long int i;
    S[0]=B[0];
    for(i=1;i<=100000;i++)
        S[i]=S[i-1]+B[i];
}

void jk()
{
    long long int i;
    for(i=0;i<=100000;i++)
        B[i]=solve(i+1);
}
int main()
{
    
    long long int q=1,l,r,AL,sum=0,ans;
    
    jk();
    
    prop_solve();
    
    //scanf("%lld",&q);
    while(q--)
    {
        scanf("%lld%lld",&l,&r);
        if(l==1)
            printf("1\n");
        else if(l==r)
            printf("%lld\n",(modexp(l,l)));
        else
        {
            AL=B[l-1];
            sum=S[r-1]-S[l-1];
            ans=modexp(AL,sum);
            printf("%lld\n",ans);
        }
    }
    
    return 0;
}
*/
//HTML TAGS from codechef
/*
#include <stdio.h>
#include<string.h>
#include<ctype.h>
void solve(char k[],int n)
{
    int i,flag=1;
    if((k[0]=='<')&&(k[1]=='/')&&(k[n-1]=='>'))
    {
    	
        for(i=2;i<n-1;i++)
        {
            if((k[i]=='<')||(k[i]=='/')||(k[i]=='>'))
            {
                flag=-1;
                break;
            }
            if((islower(k[i]))||(isdigit(k[i])))
                continue;
            else
            {
                flag=0;
                break;
            }
        }
    }
    else
        flag=-1;
    if(flag==1)
        printf("Success\n");
    else
        printf("Error\n");
}
void main()
{
    int t=1,k;
    char tag[1000];
    //scanf("%d",&t);
    while(t--)
    {
        scanf("%s",&tag);
        k=strlen(tag);
        if(k==3)
    		printf("Error\n");
    	else
        	solve(tag,k);
    }
}
*/

//MINNOTES from codechef

#include<stdio.h>
long long int b[100001];
void merge(long long int a[],long long int i1,long long int j1,long long int i2,long long int j2)
{
    long long int temp[j2+1],i=i1,j=i2,k=0;
    while((i<=j1)&&(j<=j2))
    {
        if(a[i]<a[j])
            temp[k++]=a[i++];
        else
            temp[k++]=a[j++];
    }
    while(i<=j1)
        temp[k++]=a[i++];
    while(j<=j2)
        temp[k++]=a[j++];
    for(i=i1,j=0;i<=j2;i++,j++)
        a[i]=temp[j];
}
void mergesort(long long int a[],long long int i,long long int j)
{
    long long int mid;
    if(i<j)
    {
        mid=(i+j)/2;
        mergesort(a,i,mid);
        mergesort(a,mid+1,j);
        merge(a,i,mid,mid+1,j);
    }
}
int gcd(int a, int b)
{
    if (a == 0)
        return b;
    return gcd(b % a, a);
}
int findGCD(long long int a[],long long int n,long long int index)
{
    int result,i;
    if(index==-1)
    {
    	result=a[0];
    	for (i = 1; i < n; i++)
	    {
	        result = gcd(a[i], result);
	 
	        if(result == 1)
	        {
	           return 1;
	        }
	    }
	    return result;
	}
	else
	{
		if(index==0)
		{
			result=a[1];
			for(i=2;i<n;i++)
			{
				result = gcd(a[i], result);
	 
		        if(result == 1)
		        {
		           return 1;
		        }
			}
			return result;
		}
		else
		{
			result=a[0];
			for(i=1;i<index;i++)
			{
				result = gcd(a[i], result);
	 
		        if(result == 1)
		        {
		           return 1;
		        }
			}
			for(i=index+1;i<n;i++)
			{
				result = gcd(a[i], result);
	 
		        if(result == 1)
		        {
		           return 1;
		        }
			}
			return result;
		}
	}
}
void solve(long long int n,long long int a[])
{
	mergesort(a,0,n-1);
	long long int i,index,gcd=0,sum=0;
	b[0]=findGCD(a,n,-1);
	for(i=1;i<n+1;i++)
		b[i]=findGCD(a,n,i-1);
	int flag=0;
	for(i=1;i<n+1;i++)
	{
		if(b[i]!=b[0])
		{
			flag=1;
			break;
		}
	}
	if(flag==1)
	{
		for(i=0;i<n+1;i++)
		{
			if(b[i]>gcd)
			{
				gcd=b[i];
				index=i-1;
			}
		}
		a[index]=gcd;
	}
	else if(flag==0)
	{
		a[n-1]=b[0];
		gcd=b[0];
	}
	for(i=0;i<n;i++)
		sum+=(a[i]/gcd);
	printf("%lld\n",sum);
}
int main()
{
	long long int t=1,n,i;
	//scanf("%lld",&t);
	while(t--)
	{
		scanf("%lld",&n);
		long long int a[n];
		for(i=0;i<n;i++)
			scanf("%lld",&a[i]);
		solve(n,a);
	}
	return 0;
}
